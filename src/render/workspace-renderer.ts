import { Component, Setting, setIcon } from "obsidian";
import type CustomWorkspacePlugin from "../main";
import type { Block, BlockSpan } from "../types";
import { addParamSetting, componentName, selectedStats, STAT_LABELS, type StatKey } from "../components/registry";
import { moveBlock } from "../workspace/layout";
import { t } from "../i18n";

export class WorkspaceRenderer extends Component {
  private scope?: Component;
  constructor(private readonly plugin: CustomWorkspacePlugin, private readonly container: HTMLElement, private readonly editing: () => boolean) { super(); }
  async render(): Promise<void> {
    if (this.scope) { this.removeChild(this.scope); this.scope.unload(); }
    this.scope = new Component(); this.addChild(this.scope);
    this.container.empty();
    this.container.toggleClass("is-editing", this.editing());
    if (this.editing()) this.container.createDiv({ text: t("正在编辑工作台"), cls: "cw-edit-banner" });
    for (const [index, block] of this.plugin.data.workspace.blocks.entries()) this.renderBlock(block, index, this.scope);
    if (this.editing()) this.renderAdd(this.scope);
  }
  private renderBlock(block: Block, index: number, scope: Component): void {
    const card = this.container.createDiv({ cls: `cw-block cw-span-${block.span}` });
    const definition = this.plugin.definition(block.componentId);
    const header = card.createDiv({ cls: "cw-block__header" });
    const title = header.createDiv({ cls: "cw-block__title" });
    if (definition) setIcon(title.createSpan({ cls: "cw-block__icon" }), definition.icon);
    const titleText = title.createSpan({ text: block.title || (definition ? componentName(definition) : t("未知组件")) });
    const body = card.createDiv({ cls: "cw-block__body" }); body.createDiv({ text: t("加载中…"), cls: "cw-loading" });
    let child: Component | undefined;
    let previewGeneration = 0;
    const renderPreview = async (): Promise<void> => {
      const generation = ++previewGeneration;
      if (child) { scope.removeChild(child); child.unload(); }
      body.empty(); const renderTarget = body.createDiv({ cls: "cw-preview-render" }); child = new Component(); scope.addChild(child);
      if (!definition) { renderTarget.createDiv({ text: t("未知组件"), cls: "cw-unavailable" }); return; }
      try { await definition.render(renderTarget, block, child, this.plugin); }
      catch (error) {
        if (generation !== previewGeneration) return;
        renderTarget.empty(); const detail = error instanceof Error ? `${error.message}${error.stack ? `\n${error.stack.split("\n").slice(1, 3).join("\n")}` : ""}` : String(error);
        renderTarget.createEl("pre", { text: block.componentId.startsWith("script/") ? `${block.componentId.slice(7)}\n${detail}` : detail, cls: "cw-error" });
        const retry = renderTarget.createEl("button", { text: t("重试") }); scope.registerDomEvent(retry, "click", () => void renderPreview());
      }
    };
    if (this.editing()) this.renderControls(header, card, block, index, definition?.params ?? [], scope, renderPreview, titleText, definition ? componentName(definition) : t("未知组件"));
    const ViewIntersectionObserver = card.ownerDocument.defaultView?.IntersectionObserver;
    if (!ViewIntersectionObserver) { void renderPreview(); return; }
    const observer = new ViewIntersectionObserver((entries) => { if (entries.some((entry) => entry.isIntersecting)) { observer.disconnect(); void renderPreview(); } }, { rootMargin: "160px" });
    observer.observe(card); scope.register(() => observer.disconnect());
  }
  private renderControls(header: HTMLElement, card: HTMLElement, block: Block, index: number, params: import("../params/parser").ParamDefinition[], scope: Component, refreshPreview: () => Promise<void>, titleText: HTMLElement, defaultTitle: string): void {
    const controls = header.createDiv({ cls: "cw-block__controls" });
    const button = (icon: string, label: string, action: () => void): HTMLButtonElement => {
      const element = controls.createEl("button", { attr: { "aria-label": label, title: label } }); setIcon(element, icon); scope.registerDomEvent(element, "click", action); return element;
    };
    button("arrow-up", t("上移"), () => void this.move(index, -1)); button("arrow-down", t("下移"), () => void this.move(index, 1));
    const widths = controls.createDiv({ cls: "cw-width-options", attr: { "aria-label": t("组件宽度") } });
    const widthOptions: Array<[BlockSpan, string]> = [[3, t("四分之一")], [4, t("三分之一")], [6, t("半行")], [12, t("整行")]];
    for (const [span, label] of widthOptions) {
      const option = widths.createEl("button", { text: label, cls: block.span === span ? "is-active" : "" });
      scope.registerDomEvent(option, "click", () => void this.setSpan(block, span));
    }
    button("settings-2", t("配置"), () => this.toggleConfig(card, block, params, scope, refreshPreview, titleText, defaultTitle)); button("trash-2", t("删除"), () => void this.remove(index));
  }
  private toggleConfig(card: HTMLElement, block: Block, params: import("../params/parser").ParamDefinition[], scope: Component, refreshPreview: () => Promise<void>, titleText: HTMLElement, defaultTitle: string): void {
    const existing = card.querySelector(".cw-block__config"); if (existing) { void this.render(); return; }
    const config = card.createDiv({ cls: "cw-block__config" });
    new Setting(config).setName(t("标题")).addText((text) => text.setValue(block.title ?? "").onChange(async (value) => { block.title = value || undefined; titleText.setText(block.title || defaultTitle); await this.plugin.persist(); }));
    if (block.componentId === "builtin/vault-stats") { this.renderStatsEditor(config, block, refreshPreview); return; }
    if (block.componentId === "builtin/command-buttons") { this.renderCommandEditor(config, block, refreshPreview); return; }
    if (block.componentId === "builtin/base") { this.renderBaseEditor(config, block, refreshPreview); return; }
    if (block.componentId === "builtin/dataview") { this.renderDataviewEditor(config, block, scope, refreshPreview); return; }
    for (const param of params) addParamSetting(config, param, block, async () => { await this.plugin.persist(); await refreshPreview(); });
  }
  private renderStatsEditor(container: HTMLElement, block: Block, refreshPreview: () => Promise<void>): void {
    const selected = new Set<StatKey>(selectedStats(block.params.items));
    const group = container.createDiv({ cls: "cw-stats-editor" }); group.createEl("h4", { text: t("统计项") });
    for (const [key, label] of Object.entries(STAT_LABELS) as Array<[StatKey, string]>) {
      new Setting(group).setName(t(label)).addToggle((toggle) => toggle.setValue(selected.has(key)).onChange(async (enabled) => {
        if (enabled) selected.add(key); else selected.delete(key);
        block.params.items = [...selected]; await this.plugin.persist(); await refreshPreview();
      }));
    }
  }
  private renderCommandEditor(container: HTMLElement, block: Block, refreshPreview: () => Promise<void>): void {
    const values = Array.isArray(block.params.buttons) ? block.params.buttons.filter((value): value is { [key: string]: import("../types").ParamValue } => typeof value === "object" && value !== null && !Array.isArray(value)) : [];
    const draw = (): void => {
      container.querySelector(".cw-command-editor")?.remove();
      const editor = container.createDiv({ cls: "cw-command-editor" });
      values.forEach((value, index) => {
        const row = editor.createDiv({ cls: "cw-command-editor__row" });
        new Setting(row).setName(t("显示名")).addText((text) => text.setValue(typeof value.label === "string" ? value.label : "").onChange(async (next) => { value.label = next; await this.plugin.persist(); await refreshPreview(); }));
        new Setting(row).setName(t("命令")).addDropdown((dropdown) => {
          dropdown.addOption("", t("请选择命令")); for (const command of this.plugin.commands.list()) dropdown.addOption(command.id, command.name);
          dropdown.setValue(typeof value.command === "string" ? value.command : "").onChange(async (next) => { value.command = next; await this.plugin.persist(); await refreshPreview(); });
        });
        new Setting(row).setName(t("要确认")).addToggle((toggle) => toggle.setValue(value.confirm === true).onChange(async (next) => { value.confirm = next; await this.plugin.persist(); await refreshPreview(); }));
        new Setting(row).addButton((button) => button.setButtonText(t("删除")).onClick(async () => { values.splice(index, 1); block.params.buttons = values; await this.plugin.persist(); await refreshPreview(); draw(); }));
      });
      new Setting(editor).addButton((button) => button.setButtonText(t("添加按钮")).setCta().onClick(async () => { values.push({ label: "", command: "", confirm: false }); block.params.buttons = values; await this.plugin.persist(); await refreshPreview(); draw(); }));
    };
    draw();
  }
  private renderBaseEditor(container: HTMLElement, block: Block, refreshPreview: () => Promise<void>): void {
    const files = this.plugin.app.vault.getFiles().filter((file) => file.extension === "base").sort((a, b) => a.path.localeCompare(b.path));
    if (!files.length) { container.createDiv({ text: t("仓库中没有 .base 文件"), cls: "cw-unavailable" }); return; }
    new Setting(container).setName(t("Base 文件")).addDropdown((dropdown) => {
      dropdown.addOption("", t("请选择 Base 文件"));
      for (const file of files) dropdown.addOption(file.path, file.path);
      dropdown.setValue(typeof block.params.file === "string" ? block.params.file : "").onChange(async (value) => {
        block.params.file = value; await this.plugin.persist(); await refreshPreview();
      });
    });
  }
  private renderDataviewEditor(container: HTMLElement, block: Block, scope: Component, refreshPreview: () => Promise<void>): void {
    let draft = typeof block.params.code === "string" ? block.params.code : "";
    let draftSource = typeof block.params.source === "string" ? block.params.source : "";
    new Setting(container).setName(t("查询上下文笔记")).setDesc(t("留空时使用当前活动笔记")).addText((text) => text
      .setValue(draftSource).setPlaceholder(t("笔记路径（可选）")).onChange((value) => { draftSource = value.trim(); }));
    const area = container.createEl("textarea", { cls: "cw-code-input", attr: { rows: "8", "aria-label": t("代码") } }); area.value = draft;
    scope.registerDomEvent(area, "input", () => { draft = area.value; });
    const preview = container.createDiv({ cls: "cw-dataview-preview" });
    let testChild: Component | undefined;
    new Setting(container).addButton((button) => button.setButtonText(t("试运行并保存")).setCta().onClick(async () => {
      preview.empty(); const api = this.plugin.bridge.dataview();
      if (!api) { preview.setText(t("需要 Dataview 插件")); return; }
      if (!draft.trim()) { preview.setText(t("请输入 DataviewJS 查询代码")); return; }
      if (draftSource && !this.plugin.index.find(draftSource)) { preview.setText(t("找不到查询上下文笔记")); return; }
      if (testChild) { scope.removeChild(testChild); testChild.unload(); }
      testChild = new Component(); scope.addChild(testChild);
      const source = draftSource || this.plugin.app.workspace.getActiveFile()?.path || "";
      try { await api.executeJs(draft, preview, testChild, source); block.params.code = draft; block.params.source = draftSource; await this.plugin.persist(); await refreshPreview(); preview.createDiv({ text: t("试运行成功，已保存。"), cls: "cw-success" }); }
      catch (error) { preview.createEl("pre", { text: error instanceof Error ? error.message : String(error), cls: "cw-error" }); }
    }));
  }
  private renderAdd(scope: Component): void {
    const section = this.container.createDiv({ cls: "cw-add" }); section.createEl("h3", { text: t("添加组件") });
    for (const definition of this.plugin.definitions()) {
      const button = section.createEl("button", { text: componentName(definition) });
      const icon = button.createSpan({ cls: "cw-button-icon" }); setIcon(icon, definition.icon);
      scope.registerDomEvent(button, "click", () => void this.plugin.addBlock(definition));
    }
  }
  private async move(index: number, offset: -1 | 1): Promise<void> { this.plugin.data.workspace.blocks = moveBlock(this.plugin.data.workspace.blocks, index, offset); await this.persist(); }
  private async setSpan(block: Block, span: BlockSpan): Promise<void> { block.span = span; await this.persist(); }
  private async remove(index: number): Promise<void> { this.plugin.data.workspace.blocks.splice(index, 1); await this.persist(); }
  private async persist(): Promise<void> { await this.plugin.persist(); await this.render(); }
}
