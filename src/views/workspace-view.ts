import { ItemView, WorkspaceLeaf, setIcon } from "obsidian";
import type CustomWorkspacePlugin from "../main";
import { WorkspaceRenderer } from "../render/workspace-renderer";
import { t } from "../i18n";

export const WORKSPACE_VIEW_TYPE = "cw-workspace";

export class CustomWorkspaceView extends ItemView {
  private editing = false;
  private renderer?: WorkspaceRenderer;
  private modeAction?: HTMLElement;
  constructor(leaf: WorkspaceLeaf, private readonly plugin: CustomWorkspacePlugin) { super(leaf); }
  getViewType(): string { return WORKSPACE_VIEW_TYPE; }
  getDisplayText(): string { return t("自定义工作台"); }
  getIcon(): string { return "layout-dashboard"; }
  async onOpen(): Promise<void> {
    this.contentEl.addClass("cw-root", `cw-density-${this.plugin.config.density}`);
    this.addAction("refresh-cw", t("刷新工作台"), () => void this.refreshWorkspace());
    this.modeAction = this.addAction("pencil", t("编辑模式"), () => this.toggleEditing()); this.modeAction.addClass("cw-mode-toggle");
    this.renderer = new WorkspaceRenderer(this.plugin, this.contentEl, () => this.editing); this.addChild(this.renderer);
    await this.renderer.render();
  }
  async onClose(): Promise<void> { this.renderer = undefined; this.modeAction = undefined; this.contentEl.empty(); }
  async refresh(): Promise<void> { await this.renderer?.render(); }
  private async refreshWorkspace(): Promise<void> { this.plugin.index.invalidate(); await this.plugin.reloadScripts(); await this.refresh(); }
  toggleEditing(): void { this.editing = !this.editing; this.updateModeAction(); void this.refresh(); }
  private updateModeAction(): void {
    if (!this.modeAction) return;
    setIcon(this.modeAction, this.editing ? "check" : "pencil");
    const label = this.editing ? t("完成编辑") : t("编辑模式");
    this.modeAction.setAttribute("aria-label", label); this.modeAction.setAttribute("title", label);
    this.modeAction.toggleClass("is-editing", this.editing);
  }
}
