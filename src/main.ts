import { Component, MarkdownView, Notice, Plugin, TFile, normalizePath } from "obsidian";
import { CustomWorkspaceSettingTab } from "./settings";
import { CustomWorkspaceView, WORKSPACE_VIEW_TYPE } from "./views/workspace-view";
import { DEFAULT_DATA, migrateData, type CustomWorkspaceData, type WorkspaceSettings, type Block } from "./types";
import { setLanguage, t } from "./i18n";
import { CommandService } from "./services/command-service";
import { PluginBridge } from "./services/plugin-bridge";
import { VaultIndex } from "./services/vault-index";
import { builtinById, builtinDefinitions, scriptDefinition, type ComponentDefinition } from "./components/registry";
import { parseScriptMetadata } from "./params/parser";
import { classifyTask, parseTaskLine } from "./tasks/parser";
import { estimateHistory, upsertSnapshot } from "./history/history";
import { countReadableWords } from "./metrics/text";
import type { VaultMetrics } from "./metrics/aggregate";
import { moment } from "./services/date";

interface TaskLocation { file: TFile; line: number; text: string; group: "today" | "overdue" | "completed" }

export default class CustomWorkspacePlugin extends Plugin {
  data: CustomWorkspaceData = structuredClone(DEFAULT_DATA);
  config: WorkspaceSettings = this.data.settings;
  commands = new CommandService(this.app);
  bridge = new PluginBridge(this.app);
  index = new VaultIndex(this.app, () => this.config.excludedFolders, () => this.config.recentDays, () => this.config.shortNoteThreshold);
  private scripts = new Map<string, ComponentDefinition>();
  private alive = false;
  private saveChain: Promise<void> = Promise.resolve();

  async onload(): Promise<void> {
    this.alive = true;
    this.data = migrateData(await this.loadData()); this.config = this.data.settings; setLanguage(this.config.language);
    await this.ensureScriptDirectory(); await this.reloadScripts();
    this.registerView(WORKSPACE_VIEW_TYPE, (leaf) => new CustomWorkspaceView(leaf, this));
    this.addRibbonIcon("layout-dashboard", t("打开工作台"), () => void this.openWorkspace(false));
    this.addCommand({ id: "open-workspace", name: t("打开工作台"), callback: () => void this.openWorkspace(false) });
    this.addCommand({ id: "toggle-edit-mode", name: t("切换编辑模式"), checkCallback: (checking) => {
      const view = this.app.workspace.getLeavesOfType(WORKSPACE_VIEW_TYPE)[0]?.view;
      if (!(view instanceof CustomWorkspaceView)) return false;
      if (!checking) view.toggleEditing(); return true;
    } });
    this.addSettingTab(new CustomWorkspaceSettingTab(this.app, this));
    const viewWindow = this.app.workspace.containerEl.ownerDocument.defaultView;
    let refreshTimer: number | undefined;
    const invalidate = (): void => {
      this.index.invalidate();
      if (refreshTimer !== undefined) viewWindow?.clearTimeout(refreshTimer);
      refreshTimer = viewWindow?.setTimeout(() => { refreshTimer = undefined; if (this.alive) this.refreshViews(); }, 250);
    };
    this.register(() => { if (refreshTimer !== undefined) viewWindow?.clearTimeout(refreshTimer); });
    this.registerEvent(this.app.vault.on("create", invalidate)); this.registerEvent(this.app.vault.on("delete", invalidate));
    this.registerEvent(this.app.vault.on("rename", invalidate)); this.registerEvent(this.app.vault.on("modify", invalidate));
    this.registerEvent(this.app.metadataCache.on("changed", invalidate));
    this.app.workspace.onLayoutReady(() => { if (this.alive && this.config.autoOpen && !this.app.workspace.getLeavesOfType(WORKSPACE_VIEW_TYPE).length) void this.openWorkspace(true); });
  }
  onunload(): void { this.alive = false; }

  async persist(): Promise<void> {
    this.data.settings = this.config;
    this.saveChain = this.saveChain.then(() => this.saveData(this.data));
    await this.saveChain;
  }
  definition(id: string): ComponentDefinition | undefined { return builtinById(id) ?? this.scripts.get(id); }
  definitions(): ComponentDefinition[] { return [...builtinDefinitions(), ...(this.config.allowScripts ? this.scripts.values() : [])]; }
  async addBlock(definition: ComponentDefinition): Promise<void> {
    const params = Object.fromEntries(definition.params.map((param) => [param.key, param.defaultValue]));
    const block: Block = { id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`, componentId: definition.id, span: 12, params };
    this.data.workspace.blocks.push(block); await this.persist(); this.refreshViews();
  }
  refreshViews(): void { for (const leaf of this.app.workspace.getLeavesOfType(WORKSPACE_VIEW_TYPE)) if (leaf.view instanceof CustomWorkspaceView) void leaf.view.refresh(); }

  async openWorkspace(automatic: boolean): Promise<void> {
    const existing = this.app.workspace.getLeavesOfType(WORKSPACE_VIEW_TYPE)[0];
    if (existing) { if (!automatic) await this.app.workspace.revealLeaf(existing); return; }
    const leaf = this.config.autoOpenMode === "replace" ? this.app.workspace.getLeaf(false) : this.app.workspace.getLeaf("tab");
    await leaf.setViewState({ type: WORKSPACE_VIEW_TYPE, active: true });
    if (!automatic || this.config.autoOpenMode === "new-tab") await this.app.workspace.revealLeaf(leaf);
  }

  scriptDirectory(): string { return normalizePath(`${this.manifest.dir ?? `${this.app.vault.configDir}/plugins/${this.manifest.id}`}/data`); }
  private async ensureScriptDirectory(): Promise<void> {
    const adapter = this.app.vault.adapter; const directory = this.scriptDirectory();
    if (!await adapter.exists(directory)) await adapter.mkdir(directory);
    const readme = normalizePath(`${directory}/README.md`);
    if (!await adapter.exists(readme)) await adapter.write(readme, "# Custom Workspace scripts\n\nPlace trusted `.js` files here. Scripts can read and write your vault and are not sandboxed.\n");
  }
  async reloadScripts(): Promise<void> {
    this.scripts.clear(); const listing = await this.app.vault.adapter.list(this.scriptDirectory());
    for (const path of listing.files.filter((file) => file.endsWith(".js"))) {
      const filename = path.split("/").pop(); if (!filename) continue;
      try { const source = await this.app.vault.adapter.read(path); const meta = parseScriptMetadata(source, filename); this.scripts.set(`script/${filename}`, scriptDefinition(filename, meta.name, meta.icon, meta.description, meta.params)); }
      catch { /* A broken script is surfaced when its existing block is rendered. */ }
    }
  }
  async readScript(filename: string): Promise<string> { return this.app.vault.adapter.read(normalizePath(`${this.scriptDirectory()}/${filename}`)); }
  async createScript(): Promise<void> {
    const adapter = this.app.vault.adapter; let index = 1; let filename = "my-component.js";
    while (await adapter.exists(normalizePath(`${this.scriptDirectory()}/${filename}`))) { index += 1; filename = `my-component-${index}.js`; }
    const source = `// cw:name=My component\n// cw:icon=file-code\n// cw:desc=A trusted local component\n// cw:param=title:text|Hello\n\nconst { container, params } = ctx;\ncontainer.createEl("p", { text: String(params.title) });\n`;
    await adapter.write(normalizePath(`${this.scriptDirectory()}/${filename}`), source); await this.reloadScripts();
    new Notice(`${t("已新建脚本")}: ${filename}`);
  }

  async renderTasks(container: HTMLElement, host: Component): Promise<void> {
    if (!this.config.journalFolder) { container.createDiv({ text: t("暂无内容"), cls: "cw-empty" }); return; }
    const today = moment().format("YYYY-MM-DD"); const cutoff = moment().subtract(this.config.recentDays - 1, "days").format("YYYY-MM-DD"); const tasks: TaskLocation[] = [];
    const files = this.app.vault.getMarkdownFiles().filter((file) => file.path.startsWith(`${this.config.journalFolder}/`));
    for (const file of files) {
      const parsedDate = moment(file.basename, this.config.dateFormat, true); const fileDate = parsedDate.isValid() ? parsedDate.format("YYYY-MM-DD") : undefined;
      const lines = (await this.app.vault.cachedRead(file)).split(/\r?\n/);
      lines.forEach((line, index) => { const task = parseTaskLine(line); if (!task) return; const group = classifyTask(task, fileDate, today, cutoff); if (group) tasks.push({ file, line: index, text: task.text, group }); });
    }
    for (const group of ["today", "overdue", "completed"] as const) {
      const section = container.createDiv({ cls: "cw-task-group" });
      section.createEl("h4", { text: group === "today" ? t("今天") : group === "overdue" ? t("遗留") : t("最近完成") });
      const matching = tasks.filter((task) => task.group === group);
      if (!matching.length) section.createDiv({ text: t("暂无内容"), cls: "cw-empty" });
      for (const task of matching) { const button = section.createEl("button", { text: task.text, cls: "cw-task" }); host.registerDomEvent(button, "click", () => void this.openTask(task)); }
    }
  }
  private async openTask(task: TaskLocation): Promise<void> {
    const leaf = this.app.workspace.getLeaf(false); await leaf.openFile(task.file);
    const view = leaf.view; if (view instanceof MarkdownView) { view.editor.setCursor({ line: task.line, ch: 0 }); view.editor.scrollIntoView({ from: { line: task.line, ch: 0 }, to: { line: task.line, ch: task.text.length } }, true); }
  }

  async recordHistory(metrics: VaultMetrics): Promise<void> {
    const today = moment().format("YYYY-MM-DD");
    if (!this.data.historyInitialized) {
      const notes = await Promise.all(this.app.vault.getMarkdownFiles().filter((file) => !this.config.excludedFolders.some((folder) => file.path.startsWith(`${folder}/`))).map(async (file) => ({
        created: moment(file.stat.ctime).format("YYYY-MM-DD"), words: countReadableWords(await this.app.vault.cachedRead(file)),
        links: Object.values(this.app.metadataCache.resolvedLinks[file.path] ?? {}).reduce((sum, value) => sum + value, 0)
      })));
      this.data.history = estimateHistory(notes).filter((point) => point.date < today); this.data.historyInitialized = true;
    }
    const current = this.data.history.find((point) => point.date === today);
    if (current && !current.estimated && current.notes === metrics.notes && current.links === metrics.links && current.words === metrics.words) return;
    this.data.history = upsertSnapshot(this.data.history, { date: today, notes: metrics.notes, links: metrics.links, words: metrics.words });
    await this.persist();
  }
}
