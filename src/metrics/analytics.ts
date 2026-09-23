export interface ActivityDay { date: string; count: number }
export interface FolderMetric { name: string; notes: number; words: number; paths: string[] }
export interface AnalyticsNote { path: string; words: number; mtime: number }

function localDateKey(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function aggregateActivity(notes: AnalyticsNote[], now: number, days = 365): ActivityDay[] {
  const start = new Date(now); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - Math.max(0, days - 1));
  const end = new Date(now); end.setHours(23, 59, 59, 999);
  const counts = new Map<string, number>();
  for (const note of notes) {
    if (note.mtime < start.getTime() || note.mtime > end.getTime()) continue;
    const date = localDateKey(note.mtime); counts.set(date, (counts.get(date) ?? 0) + 1);
  }
  return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, count]) => ({ date, count }));
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
