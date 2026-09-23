import { App, Modal } from "obsidian";
import type CustomWorkspacePlugin from "../main";
import { t } from "../i18n";
import { filterNotePaths } from "../metrics/note-filter";

export class DetailModal extends Modal {
  private cleanups: Array<() => void> = [];
  constructor(app: App, private readonly title: string, private readonly paths: string[], private readonly plugin: CustomWorkspacePlugin) { super(app); }
  onOpen(): void {
    this.setTitle(`${this.title} (${this.paths.length.toLocaleString()})`);
    const search = this.contentEl.createEl("input", { cls: "cw-modal-search", type: "search", placeholder: t("搜索笔记…"), attr: { "aria-label": t("搜索笔记…") } });
    const status = this.contentEl.createDiv({ cls: "cw-modal-note" });
    const list = this.contentEl.createDiv({ cls: "cw-modal-list" });
    let rowCleanups: Array<() => void> = [];
    const draw = (): void => {
      for (const cleanup of rowCleanups) cleanup(); rowCleanups = []; list.empty();
      const matches = filterNotePaths(this.paths, search.value);
      status.setText(matches.length > 500 ? `${matches.length.toLocaleString()} · ${t("仅显示前 500 项")}` : `${matches.length.toLocaleString()} ${t("条结果")}`);
      if (!matches.length) { list.createDiv({ text: t("没有匹配笔记"), cls: "cw-empty" }); return; }
      for (const path of matches.slice(0, 500)) {
        const file = this.plugin.index.find(path);
        if (file) {
          const item = list.createEl("button", { text: path, cls: "cw-modal-list__item" });
          const open = (): void => { this.close(); void this.plugin.app.workspace.getLeaf(false).openFile(file); };
          item.addEventListener("click", open); rowCleanups.push(() => item.removeEventListener("click", open));
        } else list.createDiv({ text: path, cls: "cw-modal-list__item is-static" });
      }
    };
    search.addEventListener("input", draw); this.cleanups.push(() => search.removeEventListener("input", draw), () => { for (const cleanup of rowCleanups) cleanup(); }); draw();
    const footer = this.contentEl.createDiv({ cls: "cw-modal-footer" });
    const close = footer.createEl("button", { text: t("关闭"), cls: "mod-cta" });
    this.listen(close, () => this.close());
  }
  onClose(): void { for (const cleanup of this.cleanups) cleanup(); this.cleanups = []; this.contentEl.empty(); }
  private listen(element: HTMLElement, callback: () => void): void {
    element.addEventListener("click", callback); this.cleanups.push(() => element.removeEventListener("click", callback));
  }
}
