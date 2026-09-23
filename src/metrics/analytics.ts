export interface HeatmapDay { date: string; notes: number; words: number }
export interface FolderMetric { name: string; notes: number; words: number; paths: string[] }
export interface AnalyticsNote { path: string; words: number; ctime: number; mtime: number; frontmatterCreated?: unknown }

function localDateKey(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function resolveCreatedDate(value: unknown, fallbackTimestamp: number): string {
  const fallback = localDateKey(fallbackTimestamp);
  if (typeof value !== "string" && typeof value !== "number") return fallback;
  const match = String(value).trim().match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:\D|$)/);
  if (!match) return fallback;
  const year = Number(match[1]); const month = Number(match[2]); const day = Number(match[3]);
  const parsed = new Date(year, month - 1, day);
  if (parsed.getFullYear() !== year || parsed.getMonth() !== month - 1 || parsed.getDate() !== day) return fallback;
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function aggregateHeatmap(notes: AnalyticsNote[], now: number, days = 365): HeatmapDay[] {
  const start = new Date(now); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - Math.max(0, days - 1));
  const end = new Date(now); end.setHours(23, 59, 59, 999);
  const startKey = localDateKey(start.getTime()); const endKey = localDateKey(end.getTime());
  const values = new Map<string, HeatmapDay>();
  for (const note of notes) {
    const createdDate = resolveCreatedDate(note.frontmatterCreated, note.ctime);
    if (createdDate >= startKey && createdDate <= endKey) {
      const createdDay = values.get(createdDate) ?? { date: createdDate, notes: 0, words: 0 };
      createdDay.notes += 1; values.set(createdDate, createdDay);
    }
    if (note.mtime >= start.getTime() && note.mtime <= end.getTime()) {
      const modifiedDate = localDateKey(note.mtime); const modifiedDay = values.get(modifiedDate) ?? { date: modifiedDate, notes: 0, words: 0 };
      modifiedDay.words += note.words; values.set(modifiedDate, modifiedDay);
    }
  }
  return [...values.values()].sort((a, b) => a.date.localeCompare(b.date));
}

export function aggregateTopFolders(notes: AnalyticsNote[]): FolderMetric[] {
  const folders = new Map<string, FolderMetric>();
  for (const note of notes) {
    const slash = note.path.indexOf("/"); const name = slash < 0 ? "" : note.path.slice(0, slash);
    const metric = folders.get(name) ?? { name, notes: 0, words: 0, paths: [] };
    metric.notes += 1; metric.words += note.words; metric.paths.push(note.path); folders.set(name, metric);
  }
  return [...folders.values()].sort((a, b) => b.notes - a.notes || b.words - a.words || a.name.localeCompare(b.name));
}

export function activityLevel(count: number, maximum: number): 0 | 1 | 2 | 3 | 4 | 5 {
  if (count <= 0 || maximum <= 0) return 0;
  return Math.min(5, Math.max(1, Math.ceil(count / maximum * 5))) as 1 | 2 | 3 | 4 | 5;
}

export function linePath(values: number[], maximum: number, width = 100, height = 48): string {
  if (!values.length) return "";
  const denominator = Math.max(1, values.length - 1); const ceiling = Math.max(1, maximum);
  return values.map((value, index) => `${index ? "L" : "M"} ${(index / denominator * width).toFixed(2)} ${(height - value / ceiling * height).toFixed(2)}`).join(" ");
}

export function linePathRange(values: number[], maximum: number, from: number, to: number, width = 100, height = 48): string {
  if (!values.length || from < 0 || to < from || from >= values.length) return "";
  const last = Math.min(to, values.length - 1); const denominator = Math.max(1, values.length - 1); const ceiling = Math.max(1, maximum);
  const commands: string[] = [];
  for (let index = from; index <= last; index += 1) {
    commands.push(`${index === from ? "M" : "L"} ${(index / denominator * width).toFixed(2)} ${(height - values[index] / ceiling * height).toFixed(2)}`);
  }
  return commands.join(" ");
}

export function areaPath(values: number[], maximum: number, width = 100, height = 48): string {
  const line = linePath(values, maximum, width, height);
  return line ? `${line} L ${width} ${height} L 0 ${height} Z` : "";
}
