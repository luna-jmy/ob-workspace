import { aggregateHeatmap, aggregateTopFolders, resolveCreatedDate, type FolderMetric, type HeatmapDay } from "./analytics";

export interface NoteMetricInput { path: string; words: number; ctime: number; mtime: number; frontmatterCreated?: unknown; outgoing: number; incoming: number }
export interface VaultMetrics {
  notes: number; attachments: number; folders: number; recent: number; words: number; links: number;
  notePaths: string[]; attachmentPaths: string[]; folderPaths: string[]; recentPaths: string[]; linkedPaths: string[];
  orphanPaths: string[]; emptyPaths: string[]; shortPaths: string[]; brokenPaths: string[];
  /** 未被任何 Markdown 笔记引用的附件（引用 = resolvedLinks 全部目标的并集） */
  orphanAttachmentPaths: string[];
  heatmap: HeatmapDay[]; topFolders: FolderMetric[];
}

export function aggregateMetrics(notes: NoteMetricInput[], attachmentPaths: string[], folderPaths: string[], now: number, recentDays: number, shortThreshold: number, unresolved: Record<string, Record<string, number>> = {}, referenced: Set<string> = new Set()): VaultMetrics {
  // 「最近新增」口径与热力图/最近新增组件一致：frontmatter created 优先，缺失回退 ctime，
  // 按天粒度比较（ctime 在 vault 复制/同步/迁移时会被重置，直接用它会在搬迁后暴涨）
  const cutoffKey = resolveCreatedDate(undefined, now - Math.max(1, recentDays) * 86_400_000);
  const isRecent = (note: NoteMetricInput): boolean =>
    resolveCreatedDate(note.frontmatterCreated, note.ctime) >= cutoffKey;
  return {
    notes: notes.length, attachments: attachmentPaths.length, folders: folderPaths.length,
    recent: notes.filter(isRecent).length,
    words: notes.reduce((sum, note) => sum + note.words, 0),
    links: notes.reduce((sum, note) => sum + note.outgoing, 0),
    notePaths: notes.map((note) => note.path), attachmentPaths, folderPaths,
    recentPaths: notes.filter(isRecent).map((note) => note.path),
    linkedPaths: notes.filter((note) => note.outgoing > 0).map((note) => note.path),
    orphanPaths: notes.filter((note) => note.outgoing === 0 && note.incoming === 0).map((note) => note.path),
    emptyPaths: notes.filter((note) => note.words === 0).map((note) => note.path),
    shortPaths: notes.filter((note) => note.words <= shortThreshold).map((note) => note.path),
    // 失效链接口径：正文含未解析链接（指向不存在笔记）的源笔记；采集层已按 excluded/扩展名过滤
    brokenPaths: Object.entries(unresolved).filter(([, targets]) => Object.keys(targets).length > 0).map(([source]) => source),
    // 孤立附件口径：不在引用并集（resolvedLinks 全部目标）里的附件；引用来源不限扫描范围——
    // 被排除目录的笔记引用着也算「在用」，否则换扫描范围孤立数会虚高
    orphanAttachmentPaths: attachmentPaths.filter((path) => !referenced.has(path)),
    heatmap: aggregateHeatmap(notes, now), topFolders: aggregateTopFolders(notes, folderPaths)
  };
}
