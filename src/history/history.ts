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

export interface DailyWordChange {
  date: string;
  words: number | null;
  estimated: boolean;
}

function parseLocalDate(value: string): Date | null {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const year = Number(match[1]); const month = Number(match[2]); const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
}

function localDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function dailyWordChanges(history: DailySnapshot[], endDate: string, days = 30): DailyWordChange[] {
  const end = parseLocalDate(endDate);
  if (!end || days < 1) return [];
  const sorted = [...history].sort((a, b) => a.date.localeCompare(b.date));
  const start = new Date(end); start.setDate(start.getDate() - days);
  const totals: Array<{ date: string; words: number; estimated: boolean; exact: boolean } | null> = [];
  let snapshotIndex = 0; let latest: DailySnapshot | undefined;
  for (let offset = 0; offset <= days; offset += 1) {
    const date = new Date(start); date.setDate(start.getDate() + offset); const key = localDateKey(date);
    while (snapshotIndex < sorted.length && sorted[snapshotIndex].date <= key) { latest = sorted[snapshotIndex]; snapshotIndex += 1; }
    totals.push(latest ? { date: key, words: latest.words, estimated: Boolean(latest.estimated), exact: latest.date === key } : null);
  }
  return totals.slice(1).map((current, index) => {
    const previous = totals[index]; const date = current?.date ?? localDateKey(new Date(start.getFullYear(), start.getMonth(), start.getDate() + index + 1));
    if (!current || !previous) return { date, words: null, estimated: true };
    return { date, words: current.words - previous.words, estimated: current.estimated || previous.estimated || !current.exact || !previous.exact };
  });
}
