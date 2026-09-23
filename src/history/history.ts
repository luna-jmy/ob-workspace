import type { DailySnapshot } from "../types";

export function upsertSnapshot(history: DailySnapshot[], snapshot: DailySnapshot): DailySnapshot[] {
  return [...history.filter((item) => item.date !== snapshot.date), snapshot].sort((a, b) => a.date.localeCompare(b.date));
}

export interface HistoricalNote { created: string; words: number; links: number }
export function estimateHistory(notes: HistoricalNote[]): DailySnapshot[] {
  const dates = [...new Set(notes.map((note) => note.created))].sort();
  return dates.map((date) => {
    const present = notes.filter((note) => note.created <= date);
    return { date, notes: present.length, words: present.reduce((sum, note) => sum + note.words, 0), links: present.reduce((sum, note) => sum + note.links, 0), estimated: true };
  });
}
