import { App, Modal } from "obsidian";
import type CustomWorkspacePlugin from "../main";
import { t } from "../i18n";

export class DetailModal extends Modal {
  private cleanups: Array<() => void> = [];
  constructor(app: App, private readonly title: string, private readonly paths: string[], private readonly plugin: CustomWorkspacePlugin) { super(app); }
  onOpen(): void {
    this.setTitle(`${this.title} (${this.paths.length.toLocaleString()})`);
    const list = this.contentEl.createDiv({ cls: "cw-modal-list" });
    for (const path of this.paths.slice(0, 500)) {
      const file = this.plugin.index.find(path);
      if (file) {
        const item = list.createEl("button", { text: path, cls: "cw-modal-list__item" });
        this.listen(item, () => { this.close(); void this.plugin.app.workspace.getLeaf(false).openFile(file); });
      } else list.createDiv({ text: path, cls: "cw-modal-list__item is-static" });
    }
    if (this.paths.length > 500) this.contentEl.createDiv({ text: t("仅显示前 500 项"), cls: "cw-modal-note" });
    const footer = this.contentEl.createDiv({ cls: "cw-modal-footer" });
    const close = footer.createEl("button", { text: t("关闭"), cls: "mod-cta" });
    this.listen(close, () => this.close());
  }
  onClose(): void { for (const cleanup of this.cleanups) cleanup(); this.cleanups = []; this.contentEl.empty(); }
  private listen(element: HTMLElement, callback: () => void): void {
    element.addEventListener("click", callback); this.cleanups.push(() => element.removeEventListener("click", callback));
  }
}
