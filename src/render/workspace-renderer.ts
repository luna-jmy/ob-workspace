import { Component, Setting, setIcon } from "obsidian";
import type CustomWorkspacePlugin from "../main";
import type { Block, BlockSpan } from "../types";
import { addParamSetting, componentName, selectedStats, STAT_LABELS, type StatKey } from "../components/registry";
import { cycleSpan, moveBlock } from "../workspace/layout";
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
    title.createSpan({ text: block.title || (definition ? componentName(definition) : t("未知组件")) });
    if (this.editing()) this.renderControls(header, card, block, index, definition?.params ?? [], scope);
    const body = card.createDiv({ cls: "cw-block__body" }); body.createDiv({ text: t("加载中…"), cls: "cw-loading" });
    const render = async (): Promise<void> => {
      body.empty(); const child = new Component(); scope.addChild(child);
      if (!definition) { body.createDiv({ text: t("未知组件"), cls: "cw-unavailable" }); return; }
      try { await definition.render(body, block, child, this.plugin); }
      catch (error) {
        body.empty(); const detail = error instanceof Error ? `${error.message}${error.stack ? `\n${error.stack.split("\n").slice(1, 3).join("\n")}` : ""}` : String(error);
        body.createEl("pre", { text: block.componentId.startsWith("script/") ? `${block.componentId.slice(7)}\n${detail}` : detail, cls: "cw-error" });
        const retry = body.createEl("button", { text: t("重试") }); retry.addEventListener("click", () => void render());
      }
    };
    const ViewIntersectionObserver = card.ownerDocument.defaultView?.IntersectionObserver;
    if (!ViewIntersectionObserver) { void render(); return; }
    const observer = new ViewIntersectionObserver((entries) => { if (entries.some((entry) => entry.isIntersecting)) { observer.disconnect(); void render(); } }, { rootMargin: "160px" });
    observer.observe(card); scope.register(() => observer.disconnect());
  }
  private renderControls(header: HTMLElement, card: HTMLElement, block: Block, index: number, params: import("../params/parser").ParamDefinition[], scope: Component): void {
    const controls = header.createDiv({ cls: "cw-block__controls" });
    const button = (icon: string, label: string, action: () => void): HTMLButtonElement => {
      const element = controls.createEl("button", { attr: { "aria-label": label, title: label } }); setIcon(element, icon); element.addEventListener("click", action); return element;
    };
    button("arrow-up", t("上移"), () => void this.move(index, -1)); button("arrow-down", t("下移"), () => void this.move(index, 1));
    const widths = controls.createDiv({ cls: "cw-width-options", attr: { "aria-label": t("组件宽度") } });
    const widthOptions: Array<[BlockSpan, string]> = [[3, t("四分之一")], [4, t("三分之一")], [6, t("半行")], [12, t("整行")]];
    for (const [span, label] of widthOptions) {
      const option = widths.createEl("button", { text: label, cls: block.span === span ? "is-active" : "" });
      scope.registerDomEvent(option, "click", () => void this.setSpan(block, span));
    }
    button("settings-2", t("配置"), () => this.toggleConfig(card, block, params, scope)); button("trash-2", t("删除"), () => void this.remove(index));
    scope.registerDomEvent(card, "keydown", (event) => {
      if (!event.altKey) return;
      if (event.key === "ArrowUp") { event.preventDefault(); void this.move(index, -1); }
      if (event.key === "ArrowDown") { event.preventDefault(); void this.move(index, 1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); void this.changeSpan(block, -1); }
      if (event.key === "ArrowRight") { event.preventDefault(); void this.changeSpan(block, 1); }
    });
    card.tabIndex = 0;
  }
  private toggleConfig(card: HTMLElement, block: Block, params: import("../params/parser").ParamDefinition[], scope: Component): void {
    const existing = card.querySelector(".cw-block__config"); if (existing) { existing.remove(); return; }
    const config = card.createDiv({ cls: "cw-block__config" });
    new Setting(config).setName(t("标题")).addText((text) => text.setValue(block.title ?? "").onChange(async (value) => { block.title = value || undefined; await this.plugin.persist(); }));
    if (block.componentId === "builtin/vault-stats") { this.renderStatsEditor(config, block); return; }
    if (block.componentId === "builtin/command-buttons") { this.renderCommandEditor(config, block); return; }
    if (block.componentId === "builtin/dataview") { this.renderDataviewEditor(config, block, scope); return; }
    for (const param of params) addParamSetting(config, param, block, async () => this.persist());
  }
  private renderStatsEditor(container: HTMLElement, block: Block): void {
    const selected = new Set<StatKey>(selectedStats(block.params.items));
    const group = container.createDiv({ cls: "cw-stats-editor" }); group.createEl("h4", { text: t("统计项") });
    for (const [key, label] of Object.entries(STAT_LABELS) as Array<[StatKey, string]>) {
      new Setting(group).setName(t(label)).addToggle((toggle) => toggle.setValue(selected.has(key)).onChange(async (enabled) => {
        if (enabled) selected.add(key); else selected.delete(key);
        block.params.items = [...selected]; await this.plugin.persist();
      }));
    }
  }
  private renderCommandEditor(container: HTMLElement, block: Block): void {
    const values = Array.isArray(block.params.buttons) ? block.params.buttons.filter((value): value is { [key: string]: import("../types").ParamValue } => typeof value === "object" && value !== null && !Array.isArray(value)) : [];
    const draw = (): void => {
      container.querySelector(".cw-command-editor")?.remove();
      const editor = container.createDiv({ cls: "cw-command-editor" });
      values.forEach((value, index) => {
        const row = editor.createDiv({ cls: "cw-command-editor__row" });
        new Setting(row).setName(t("显示名")).addText((text) => text.setValue(typeof value.label === "string" ? value.label : "").onChange(async (next) => { value.label = next; await this.plugin.persist(); }));
        new Setting(row).setName(t("命令")).addDropdown((dropdown) => {
          dropdown.addOption("", t("请选择命令")); for (const command of this.plugin.commands.list()) dropdown.addOption(command.id, command.name);
          dropdown.setValue(typeof value.command === "string" ? value.command : "").onChange(async (next) => { value.command = next; await this.plugin.persist(); });
        });
        new Setting(row).setName(t("要确认")).addToggle((toggle) => toggle.setValue(value.confirm === true).onChange(async (next) => { value.confirm = next; await this.plugin.persist(); }));
        new Setting(row).addButton((button) => button.setButtonText(t("删除")).onClick(async () => { values.splice(index, 1); block.params.buttons = values; await this.plugin.persist(); draw(); }));
      });
      new Setting(editor).addButton((button) => button.setButtonText(t("添加按钮")).setCta().onClick(async () => { values.push({ label: "", command: "", confirm: false }); block.params.buttons = values; await this.plugin.persist(); draw(); }));
    };
    draw();
  }
  private renderDataviewEditor(container: HTMLElement, block: Block, scope: Component): void {
    let draft = typeof block.params.code === "string" ? block.params.code : "";
    const area = container.createEl("textarea", { cls: "cw-code-input", attr: { rows: "8", "aria-label": t("代码") } }); area.value = draft;
    scope.registerDomEvent(area, "input", () => { draft = area.value; });
    const preview = container.createDiv({ cls: "cw-dataview-preview" });
    new Setting(container).addButton((button) => button.setButtonText(t("试运行并保存")).setCta().onClick(async () => {
      preview.empty(); const api = this.plugin.bridge.dataview();
      if (!api) { preview.setText(t("需要 Dataview 插件")); return; }
      const child = new Component(); scope.addChild(child);
      try { await api.executeJs(draft, preview, child, this.plugin.app.workspace.getActiveFile()?.path ?? ""); block.params.code = draft; await this.plugin.persist(); preview.createDiv({ text: t("试运行成功，已保存。"), cls: "cw-success" }); }
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
  private async changeSpan(block: Block, direction: -1 | 1): Promise<void> { block.span = cycleSpan(block.span, direction); await this.persist(); }
  private async setSpan(block: Block, span: BlockSpan): Promise<void> { block.span = span; await this.persist(); }
  private async remove(index: number): Promise<void> { this.plugin.data.workspace.blocks.splice(index, 1); await this.persist(); }
  private async persist(): Promise<void> { await this.plugin.persist(); await this.render(); }
}
