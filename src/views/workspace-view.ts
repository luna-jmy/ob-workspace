import { ItemView, WorkspaceLeaf } from "obsidian";
import type CustomWorkspacePlugin from "../main";
import { WorkspaceRenderer } from "../render/workspace-renderer";
import { t } from "../i18n";

export const WORKSPACE_VIEW_TYPE = "cw-workspace";

export class CustomWorkspaceView extends ItemView {
  private editing = false;
  private renderer?: WorkspaceRenderer;
  constructor(leaf: WorkspaceLeaf, private readonly plugin: CustomWorkspacePlugin) { super(leaf); }
  getViewType(): string { return WORKSPACE_VIEW_TYPE; }
  getDisplayText(): string { return t("自定义工作台"); }
  getIcon(): string { return "layout-dashboard"; }
  async onOpen(): Promise<void> {
    this.contentEl.addClass("cw-root", `cw-density-${this.plugin.config.density}`);
    this.addAction("pencil", t("编辑模式"), () => { this.editing = !this.editing; void this.refresh(); });
    this.renderer = new WorkspaceRenderer(this.plugin, this.contentEl, () => this.editing); this.addChild(this.renderer);
    await this.renderer.render();
  }
  async onClose(): Promise<void> { this.renderer = undefined; this.contentEl.empty(); }
  async refresh(): Promise<void> { await this.renderer?.render(); }
  toggleEditing(): void { this.editing = !this.editing; void this.refresh(); }
}
