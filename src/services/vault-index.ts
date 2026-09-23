import type { App, TAbstractFile } from "obsidian";
import { TFile } from "obsidian";
import { countReadableWords } from "../metrics/text";
import { aggregateMetrics, type VaultMetrics } from "../metrics/aggregate";

export class VaultIndex {
  private metricsPromise?: Promise<VaultMetrics>;
  constructor(private readonly app: App, private readonly excluded: () => string[], private readonly recentDays: () => number, private readonly threshold: () => number) {}
  invalidate(): void { this.metricsPromise = undefined; }
  private included(path: string): boolean { return !this.excluded().some((folder) => path === folder || path.startsWith(`${folder}/`)); }
  async metrics(): Promise<VaultMetrics> {
    this.metricsPromise ??= this.compute();
    return this.metricsPromise;
  }
  private async compute(): Promise<VaultMetrics> {
    const markdown = this.app.vault.getMarkdownFiles().filter((file) => this.included(file.path));
    const incoming = new Map<string, number>();
    const resolved = this.app.metadataCache.resolvedLinks;
    for (const targets of Object.values(resolved)) for (const [path, count] of Object.entries(targets)) incoming.set(path, (incoming.get(path) ?? 0) + count);
    const notes = await Promise.all(markdown.map(async (file) => ({
      path: file.path, ctime: file.stat.ctime, mtime: file.stat.mtime, words: countReadableWords(await this.app.vault.cachedRead(file)),
      outgoing: Object.values(resolved[file.path] ?? {}).reduce((sum, count) => sum + count, 0), incoming: incoming.get(file.path) ?? 0
    })));
    const files = this.app.vault.getFiles().filter((file) => this.included(file.path));
    const attachmentPaths = files.filter((file) => file.extension !== "md").map((file) => file.path);
    const folderPaths = [...new Set(files.map((file) => file.parent?.path).filter((path): path is string => Boolean(path)))];
    return aggregateMetrics(notes, attachmentPaths, folderPaths, Date.now(), this.recentDays(), this.threshold());
  }
  recentNotes(limit: number, folder = ""): TFile[] {
    return this.app.vault.getMarkdownFiles().filter((file) => this.included(file.path) && (!folder || file.path.startsWith(`${folder}/`)))
      .sort((a, b) => b.stat.mtime - a.stat.mtime).slice(0, limit);
  }
  find(path: string): TFile | null { const file: TAbstractFile | null = this.app.vault.getAbstractFileByPath(path); return file instanceof TFile ? file : null; }
}
