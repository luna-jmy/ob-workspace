import { aggregateHeatmap, aggregateTopFolders, type FolderMetric, type HeatmapDay } from "./analytics";

export interface NoteMetricInput { path: string; words: number; ctime: number; mtime: number; frontmatterCreated?: unknown; outgoing: number; incoming: number }
export interface VaultMetrics {
  notes: number; attachments: number; folders: number; recent: number; words: number; links: number;
  notePaths: string[]; attachmentPaths: string[]; folderPaths: string[]; recentPaths: string[]; linkedPaths: string[];
  orphanPaths: string[]; emptyPaths: string[]; shortPaths: string[];
  heatmap: HeatmapDay[]; topFolders: FolderMetric[];
}

export function aggregateMetrics(notes: NoteMetricInput[], attachmentPaths: string[], folderPaths: string[], now: number, recentDays: number, shortThreshold: number): VaultMetrics {
  const recentCutoff = now - recentDays * 86_400_000;
  return {
    notes: notes.length, attachments: attachmentPaths.length, folders: folderPaths.length,
    recent: notes.filter((note) => note.ctime >= recentCutoff).length,
    words: notes.reduce((sum, note) => sum + note.words, 0),
    links: notes.reduce((sum, note) => sum + note.outgoing, 0),
    notePaths: notes.map((note) => note.path), attachmentPaths, folderPaths,
    recentPaths: notes.filter((note) => note.ctime >= recentCutoff).map((note) => note.path),
    linkedPaths: notes.filter((note) => note.outgoing > 0).map((note) => note.path),
    orphanPaths: notes.filter((note) => note.outgoing === 0 && note.incoming === 0).map((note) => note.path),
    emptyPaths: notes.filter((note) => note.words === 0).map((note) => note.path),
    shortPaths: notes.filter((note) => note.words <= shortThreshold).map((note) => note.path),
    heatmap: aggregateHeatmap(notes, now), topFolders: aggregateTopFolders(notes)
  };
}
