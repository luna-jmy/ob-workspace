export interface NoteMetricInput { path: string; words: number; ctime: number; outgoing: number; incoming: number }
export interface VaultMetrics { notes: number; attachments: number; folders: number; recent: number; words: number; links: number; orphanPaths: string[]; emptyPaths: string[]; shortPaths: string[] }

export function aggregateMetrics(notes: NoteMetricInput[], attachments: number, folders: number, now: number, recentDays: number, shortThreshold: number): VaultMetrics {
  const recentCutoff = now - recentDays * 86_400_000;
  return {
    notes: notes.length, attachments, folders,
    recent: notes.filter((note) => note.ctime >= recentCutoff).length,
    words: notes.reduce((sum, note) => sum + note.words, 0),
    links: notes.reduce((sum, note) => sum + note.outgoing, 0),
    orphanPaths: notes.filter((note) => note.outgoing === 0 && note.incoming === 0).map((note) => note.path),
    emptyPaths: notes.filter((note) => note.words === 0).map((note) => note.path),
    shortPaths: notes.filter((note) => note.words <= shortThreshold).map((note) => note.path)
  };
}
