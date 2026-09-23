import { Component, MarkdownRenderer, Notice, Setting, setIcon } from "obsidian";
import type CustomWorkspacePlugin from "../main";
import type { Block, ParamValue } from "../types";
import type { ParamDefinition } from "../params/parser";
import { renderFilenamePattern } from "../params/parser";
import { t } from "../i18n";
import { runScript } from "../services/script-runner";
import { moment } from "../services/date";
import { DetailModal } from "../ui/detail-modal";

function paramString(value: ParamValue | undefined, fallback = ""): string {
  return typeof value === "string" || typeof value === "number" || typeof value === "boolean" ? String(value) : fallback;
}
function paramNumber(value: ParamValue | undefined, fallback: number): number {
  if (typeof value !== "string" && typeof value !== "number") return fallback;
  const parsed = Number(value); return Number.isFinite(parsed) ? parsed : fallback;
}

export interface ComponentDefinition {
  id: string; name: string; icon: string; description: string; params: ParamDefinition[];
  render(container: HTMLElement, block: Block, host: Component, plugin: CustomWorkspacePlugin): Promise<void>;
}

const STAT_KEYS = ["notes", "attachments", "folders", "recent", "words", "links", "orphans", "empty"] as const;
export type StatKey = typeof STAT_KEYS[number];
export const STAT_LABELS: Record<StatKey, string> = {
  notes: "笔记", attachments: "附件", folders: "文件夹", recent: "最近新增", words: "可读字数", links: "链接", orphans: "孤立笔记", empty: "空笔记"
};
export function selectedStats(value: ParamValue | undefined): StatKey[] {
  if (!Array.isArray(value)) return [...STAT_KEYS];
  const selected = value.filter((item): item is StatKey => typeof item === "string" && STAT_KEYS.includes(item as StatKey));
  return selected.length ? selected : [...STAT_KEYS];
}

function metric(container: HTMLElement, label: string, value: number, paths: string[], plugin: CustomWorkspacePlugin, host: Component): void {
  const button = container.createEl("button", { cls: "cw-metric" });
  button.createSpan({ cls: "cw-metric__value", text: value.toLocaleString() });
  button.createSpan({ cls: "cw-metric__label", text: label });
  if (paths.length) { button.addClass("is-clickable"); host.registerDomEvent(button, "click", () => new DetailModal(plugin.app, label, paths, plugin).open()); }
}

const vaultStats: ComponentDefinition = {
  id: "builtin/vault-stats", name: "仓库统计", icon: "database", description: "", params: [],
  async render(container, block, host, plugin) {
    const data = await plugin.index.metrics(); await plugin.recordHistory(data);
    const grid = container.createDiv({ cls: "cw-metrics" });
    const selected = selectedStats(block.params.items);
    if (selected.includes("notes")) metric(grid, t("笔记"), data.notes, data.notePaths, plugin, host);
    if (selected.includes("attachments")) metric(grid, t("附件"), data.attachments, data.attachmentPaths, plugin, host);
    if (selected.includes("folders")) metric(grid, t("文件夹"), data.folders, data.folderPaths, plugin, host);
    if (selected.includes("recent")) metric(grid, t("最近新增"), data.recent, data.recentPaths, plugin, host);
    if (selected.includes("words")) metric(grid, t("可读字数"), data.words, data.notePaths, plugin, host);
    if (selected.includes("links")) metric(grid, t("链接"), data.links, data.linkedPaths, plugin, host);
    if (selected.includes("orphans")) metric(grid, t("孤立笔记"), data.orphanPaths.length, data.orphanPaths, plugin, host);
    if (selected.includes("empty")) metric(grid, t("空笔记"), data.emptyPaths.length, data.emptyPaths, plugin, host);
  }
};

const quickJump: ComponentDefinition = {
  id: "builtin/quick-jump", name: "快速跳转", icon: "files", description: "", params: [
    { key: "limit", type: "number", defaultValue: 8 }, { key: "folder", type: "folder", defaultValue: "" }
  ],
  async render(container, block, _host, plugin) {
    const files = plugin.index.recentNotes(paramNumber(block.params.limit, 8), paramString(block.params.folder));
    if (!files.length) { container.createDiv({ text: t("暂无内容"), cls: "cw-empty" }); return; }
    for (const file of files) {
      const button = container.createEl("button", { cls: "cw-note-link" });
      button.createSpan({ text: file.basename }); button.createEl("time", { text: moment(file.stat.mtime).format("MM-DD HH:mm") });
      button.addEventListener("click", () => void plugin.app.workspace.getLeaf(false).openFile(file));
    }
  }
};

interface CommandButton { label?: ParamValue; icon?: ParamValue; command?: ParamValue; confirm?: ParamValue }
const commandButtons: ComponentDefinition = {
  id: "builtin/command-buttons", name: "命令按钮", icon: "command", description: "", params: [],
  async render(container, block, _host, plugin) {
    if (!plugin.commands.available()) { unavailable(container, t("命令接口不可用")); return; }
    const buttons = Array.isArray(block.params.buttons) ? block.params.buttons as CommandButton[] : [];
    if (!buttons.length) { container.createDiv({ text: t("尚无命令按钮，请在编辑模式配置。"), cls: "cw-empty" }); return; }
    const wrapper = container.createDiv({ cls: "cw-actions" });
    for (const definition of buttons) {
      const command = paramString(definition.command); const known = plugin.commands.list().some((item) => item.id === command);
      const button = wrapper.createEl("button", { text: paramString(definition.label, command), cls: "mod-cta" });
      if (definition.icon) setIcon(button.createSpan({ cls: "cw-button-icon" }), paramString(definition.icon));
      button.disabled = !known;
      button.addEventListener("click", () => {
        if (definition.confirm && !container.ownerDocument.defaultView?.confirm(paramString(definition.label, command))) return;
        plugin.commands.execute(command);
      });
    }
  }
};

const health: ComponentDefinition = {
  id: "builtin/note-health", name: "笔记健康度", icon: "heart-pulse", description: "", params: [],
  async render(container, _block, host, plugin) {
    const data = await plugin.index.metrics(); const grid = container.createDiv({ cls: "cw-metrics" });
    metric(grid, t("孤立笔记"), data.orphanPaths.length, data.orphanPaths, plugin, host);
    metric(grid, t("空笔记"), data.emptyPaths.length, data.emptyPaths, plugin, host);
    metric(grid, t("短笔记"), data.shortPaths.length, data.shortPaths, plugin, host);
  }
};

const graph: ComponentDefinition = {
  id: "builtin/graph", name: "知识图谱", icon: "git-fork", description: "", params: [{ key: "file", type: "note", defaultValue: "" }],
  async render(container, block, host, plugin) {
    const resolved = plugin.app.metadataCache.resolvedLinks;
    const configured = paramString(block.params.file); let active = configured ? plugin.index.find(configured) : plugin.app.workspace.getActiveFile();
    if (!active) {
      const degrees = new Map<string, number>();
      for (const [source, targets] of Object.entries(resolved)) {
        degrees.set(source, (degrees.get(source) ?? 0) + Object.keys(targets).length);
        for (const [target, count] of Object.entries(targets)) degrees.set(target, (degrees.get(target) ?? 0) + count);
      }
      const rootPath = [...degrees.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]; active = rootPath ? plugin.index.find(rootPath) : null;
    }
    if (!active) { unavailable(container, t("仓库里还没有可预览的链接关系")); return; }
    const outgoing = Object.keys(resolved[active.path] ?? {});
    const incoming = Object.entries(resolved).filter(([, targets]) => active.path in targets).map(([path]) => path);
    const paths = [...new Set([...outgoing, ...incoming])].filter((path) => path !== active.path).slice(0, 12);
    const preview = container.createDiv({ cls: "cw-graph-preview" });
    const lines = preview.createSvg("svg", { cls: "cw-graph-preview__lines", attr: { viewBox: "0 0 100 100", preserveAspectRatio: "none", "aria-hidden": "true" } });
    const center = preview.createEl("button", { text: active.basename, cls: "cw-graph-node cw-graph-node--center" });
    host.registerDomEvent(center, "click", () => void plugin.app.workspace.getLeaf(false).openFile(active));
    paths.forEach((path, index) => {
      const angle = index / Math.max(paths.length, 1) * Math.PI * 2 - Math.PI / 2; const x = 50 + Math.cos(angle) * 39; const y = 50 + Math.sin(angle) * 38;
      lines.createSvg("line", { attr: { x1: "50", y1: "50", x2: String(x), y2: String(y) } });
      const node = preview.createEl("button", { text: path.split("/").pop()?.replace(/\.md$/i, "") ?? path, cls: "cw-graph-node" });
      node.style.setProperty("--cw-node-x", `${x}%`); node.style.setProperty("--cw-node-y", `${y}%`);
      host.registerDomEvent(node, "click", () => { const file = plugin.index.find(path); if (file) void plugin.app.workspace.getLeaf(false).openFile(file); });
    });
    if (!paths.length) preview.createDiv({ text: t("当前笔记暂无已解析关系"), cls: "cw-graph-empty" });
  }
};

const templater: ComponentDefinition = {
  id: "builtin/quick-create", name: "快速新建", icon: "file-plus", description: "", params: [
    { key: "template", type: "note", defaultValue: "" }, { key: "folder", type: "folder", defaultValue: "" },
    { key: "filename", type: "text", defaultValue: "{{date:YYYY-MM-DD}} {{title}}" }, { key: "title", type: "text", defaultValue: "" }
  ],
  async render(container, block, _host, plugin) {
    const api = plugin.bridge.templater(); if (!api) { unavailable(container, t("需要 Templater 插件")); return; }
    const button = container.createEl("button", { text: t("快速新建"), cls: "mod-cta" });
    button.addEventListener("click", () => {
      const filename = renderFilenamePattern(paramString(block.params.filename, "{{date:YYYY-MM-DD}}"), paramString(block.params.title), (format) => moment().format(format));
      void api.create_new_note_from_template(paramString(block.params.template), paramString(block.params.folder), filename, true)
        .catch((error: unknown) => new Notice(error instanceof Error ? error.message : String(error)));
    });
  }
};

const dataview: ComponentDefinition = {
  id: "builtin/dataview", name: "Dataview 查询", icon: "table", description: "", params: [{ key: "code", type: "text", defaultValue: "" }],
  async render(container, block, host, plugin) {
    const api = plugin.bridge.dataview(); if (!api) { unavailable(container, t("需要 Dataview 插件")); return; }
    await api.executeJs(paramString(block.params.code), container, host, plugin.app.workspace.getActiveFile()?.path ?? "");
  }
};

const baseView: ComponentDefinition = {
  id: "builtin/base", name: "Base 视图", icon: "layout-list", description: "", params: [{ key: "file", type: "note", defaultValue: "" }],
  async render(container, block, host, plugin) {
    const path = paramString(block.params.file);
    if (!path) { unavailable(container, t("组件不可用")); return; }
    await MarkdownRenderer.render(plugin.app, `![[${path}]]`, container, "", host);
    const open = container.createEl("button", { text: t("打开"), cls: "cw-link-button" });
    open.addEventListener("click", () => { const file = plugin.index.find(path); if (file) void plugin.app.workspace.getLeaf(false).openFile(file); });
  }
};

const wordsTrend: ComponentDefinition = {
  id: "builtin/trends", name: "字数与趋势", icon: "chart-line", description: "", params: [],
  async render(container, _block, _host, plugin) {
    const history = plugin.config.showEstimatedHistory ? plugin.data.history : plugin.data.history.filter((point) => !point.estimated);
    if (!history.length) { container.createDiv({ text: t("暂无内容"), cls: "cw-empty" }); return; }
    const max = Math.max(...history.map((point) => point.words), 1); const chart = container.createDiv({ cls: "cw-chart" });
    for (const point of history.slice(-90)) {
      const bar = chart.createDiv({ cls: `cw-chart__bar${point.estimated ? " is-estimated" : ""}` });
      bar.style.setProperty("--cw-bar-height", `${Math.max(2, point.words / max * 100)}%`); bar.ariaLabel = `${point.date}: ${point.words}`;
    }
  }
};

const todayTasks: ComponentDefinition = {
  id: "builtin/today-tasks", name: "今日任务", icon: "list-checks", description: "", params: [],
  async render(container, _block, host, plugin) { await plugin.renderTasks(container, host); }
};

const BUILTINS = [vaultStats, todayTasks, quickJump, commandButtons, health, wordsTrend, graph, templater, baseView, dataview];

export function builtinDefinitions(): ComponentDefinition[] { return BUILTINS; }
export function builtinById(id: string): ComponentDefinition | undefined { return BUILTINS.find((definition) => definition.id === id); }
export function componentName(definition: ComponentDefinition): string {
  const names: Record<string, string> = {
    "builtin/vault-stats": t("仓库统计"), "builtin/today-tasks": t("今日任务"), "builtin/quick-jump": t("快速跳转"),
    "builtin/command-buttons": t("命令按钮"), "builtin/note-health": t("笔记健康度"), "builtin/trends": t("字数与趋势"),
    "builtin/graph": t("知识图谱"), "builtin/quick-create": t("快速新建"), "builtin/base": t("Base 视图"),
    "builtin/dataview": t("Dataview 查询")
  };
  return names[definition.id] ?? definition.name;
}

export function scriptDefinition(filename: string, name: string, icon: string, description: string, params: ParamDefinition[]): ComponentDefinition {
  return { id: `script/${filename}`, name, icon, description, params, async render(container, block, host, plugin) {
    if (!plugin.config.allowScripts) { unavailable(container, t("已在设置里关闭脚本执行")); return; }
    const body = await plugin.readScript(filename);
    await runScript(body, { app: plugin.app, container, params: block.params, moment, component: host,
      size: { width: container.clientWidth, height: container.clientHeight } });
  } };
}

export function addParamSetting(parent: HTMLElement, definition: ParamDefinition, block: Block, onChange: () => Promise<void>): void {
  const setting = new Setting(parent).setName(definition.key);
  const value = block.params[definition.key] ?? definition.defaultValue;
  if (definition.type === "boolean") setting.addToggle((toggle) => toggle.setValue(Boolean(value)).onChange(async (next) => { block.params[definition.key] = next; await onChange(); }));
  else if (definition.type === "number") setting.addText((text) => text.setValue(paramString(value, "0")).onChange(async (next) => { const parsed = Number(next); if (Number.isFinite(parsed)) { block.params[definition.key] = parsed; await onChange(); } }));
  else if (definition.type.startsWith("select:")) setting.addDropdown((dropdown) => {
    for (const option of definition.type.slice(7).split(",")) dropdown.addOption(option, option);
    dropdown.setValue(paramString(value)).onChange(async (next) => { block.params[definition.key] = next; await onChange(); });
  });
  else setting.addText((text) => text.setValue(paramString(value)).setPlaceholder(t("请输入值")).onChange(async (next) => { block.params[definition.key] = next; await onChange(); }));
}

function unavailable(container: HTMLElement, message: string): void { container.createDiv({ text: message, cls: "cw-unavailable" }); }
