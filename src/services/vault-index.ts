import type { App, TAbstractFile } from "obsidian";
import { getAllTags, TFile } from "obsidian";
import { countReadableWords } from "../metrics/text";
import { aggregateMetrics, type VaultMetrics } from "../metrics/aggregate";
import { matchesNoteFilter, type NoteFilter } from "../metrics/note-filter";
import { moment } from "./date";

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
    const notes = await Promise.all(markdown.map(async (file) => {
      const cache = this.app.metadataCache.getFileCache(file);
      const frontmatter: Record<string, unknown> | undefined = cache?.frontmatter;
      return {
        path: file.path, ctime: file.stat.ctime, mtime: file.stat.mtime, frontmatterCreated: frontmatter?.created,
        words: countReadableWords(await this.app.vault.cachedRead(file)),
        outgoing: Object.values(resolved[file.path] ?? {}).reduce((sum, count) => sum + count, 0), incoming: incoming.get(file.path) ?? 0
      };
    }));
    const files = this.app.vault.getFiles().filter((file) => this.included(file.path));
    const attachmentPaths = files.filter((file) => file.extension !== "md").map((file) => file.path);
    const folderPaths = [...new Set(files.map((file) => file.parent?.path).filter((path): path is string => Boolean(path)))];
    return aggregateMetrics(notes, attachmentPaths, folderPaths, Date.now(), this.recentDays(), this.threshold());
  }
  recentNotes(limit: number, filter: NoteFilter = {}): TFile[] {
    return this.app.vault.getMarkdownFiles().filter((file) => {
      if (!this.included(file.path)) return false;
      const cache = this.app.metadataCache.getFileCache(file);
      return matchesNoteFilter({ path: file.path, tags: cache ? getAllTags(cache) ?? [] : [], frontmatter: cache?.frontmatter }, filter);
    })
      .sort((a, b) => b.stat.mtime - a.stat.mtime).slice(0, limit);
  }
  find(path: string): TFile | null { const file: TAbstractFile | null = this.app.vault.getAbstractFileByPath(path); return file instanceof TFile ? file : null; }
  /**
   * 最近新增笔记：created 取 frontmatter.created（解析失败回退文件 ctime），
   * 限定最近 days 天内、按 created 倒序、截取 limit 条。支持与快速跳转同款的筛选。
   */
  recentCreatedNotes(limit: number, days: number, filter: NoteFilter = {}): { file: TFile; created: number }[] {
    const cutoff = Date.now() - Math.max(1, days) * 86400000;
    const matched: { file: TFile; created: number }[] = [];
    for (const file of this.app.vault.getMarkdownFiles()) {
      if (!this.included(file.path)) continue;
      const cache = this.app.metadataCache.getFileCache(file);
      if (!matchesNoteFilter({ path: file.path, tags: cache ? getAllTags(cache) ?? [] : [], frontmatter: cache?.frontmatter }, filter)) continue;
      const raw: unknown = cache?.frontmatter?.created;
      let created = file.stat.ctime;
      if (typeof raw === "string" || typeof raw === "number") {
        const parsed = moment(raw).valueOf();
        if (Number.isFinite(parsed) && parsed > 0) created = parsed;
      }
      if (created >= cutoff) matched.push({ file, created });
    }
    return matched.sort((a, b) => b.created - a.created).slice(0, Math.max(1, limit));
  }
}
