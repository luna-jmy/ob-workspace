export interface ParsedTask {
  text: string; completed: boolean; due?: string; scheduled?: string; start?: string; done?: string; created?: string;
  priority?: string; tags: string[]; fields: Record<string, string>;
}

const DATE_MARKERS: Record<string, keyof Pick<ParsedTask, "due" | "scheduled" | "start" | "done" | "created">> = {
  "📅": "due", "⏳": "scheduled", "🛫": "start", "✅": "done", "➕": "created"
};

export function parseTaskLine(line: string): ParsedTask | null {
  const match = line.match(/^\s*-\s+\[([ xX])\]\s+(.+)$/);
  if (!match) return null;
  const text = match[2];
  const task: ParsedTask = { text, completed: match[1].toLowerCase() === "x", tags: [], fields: {} };
  for (const [marker, field] of Object.entries(DATE_MARKERS)) {
    const date = text.match(new RegExp(`${marker}\\s*(\\d{4}-\\d{2}-\\d{2})`))?.[1];
    if (date && isIsoDate(date)) task[field] = date;
  }
  task.priority = text.match(/[🔺⏫🔼🔽⏬]/u)?.[0];
  task.tags = [...text.matchAll(/(?:^|\s)#([\p{L}\p{N}_/-]+)/gu)].map((item) => item[1]);
  for (const item of text.matchAll(/([\p{L}\p{N}_-]+)::\s*([^\s].*?)(?=\s+[\p{L}\p{N}_-]+::|$)/gu)) task.fields[item[1]] = item[2].trim();
  return task;
}

function isIsoDate(value: string): boolean {
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function assignedDate(task: ParsedTask, fileDate?: string): string | undefined {
  return task.due ?? task.scheduled ?? task.start ?? fileDate;
}

export function classifyTask(task: ParsedTask, fileDate: string | undefined, today: string, recentCutoff: string): "today" | "overdue" | "completed" | null {
  if (task.completed) return task.done && task.done >= recentCutoff && task.done <= today ? "completed" : null;
  const date = assignedDate(task, fileDate);
  if (date === today) return "today";
  if (date && date < today) return "overdue";
  return null;
}
