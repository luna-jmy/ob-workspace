export interface NoteFilter {
  folder?: string;
  tag?: string;
  frontmatterKey?: string;
  frontmatterValue?: string;
}

export interface FilterableNote {
  path: string;
  tags: string[];
  frontmatter?: Record<string, unknown>;
}

function readFrontmatterValue(frontmatter: Record<string, unknown> | undefined, key: string): unknown {
  let value: unknown = frontmatter;
  for (const part of key.split(".").filter(Boolean)) {
    if (typeof value !== "object" || value === null || Array.isArray(value)) return undefined;
    value = (value as Record<string, unknown>)[part];
  }
  return value;
}

function matchesValue(value: unknown, expected: string): boolean {
  if (Array.isArray(value)) return value.some((item) => matchesValue(item, expected));
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.toLocaleLowerCase() === expected.toLocaleLowerCase();
  if (typeof value === "number" || typeof value === "boolean") return value.toString().toLocaleLowerCase() === expected.toLocaleLowerCase();
  return false;
}

/** 目录参数解析：逗号 / 全角逗号分隔多个目录，逐段去空白与首尾斜杠，空段丢弃。 */
export function parseFolderList(raw: string | undefined): string[] {
  return (raw ?? "")
    .split(/[,，]/)
    .map((piece) => piece.trim().replace(/^\/+|\/+$/g, ""))
    .filter((piece) => piece !== "");
}

export function matchesNoteFilter(note: FilterableNote, filter: NoteFilter): boolean {
  const folders = parseFolderList(filter.folder);
  if (folders.length && !folders.some((folder) => note.path.startsWith(`${folder}/`))) return false;
  const tag = filter.tag ? `#${filter.tag.replace(/^#/, "")}`.toLocaleLowerCase() : "";
  if (tag && !note.tags.some((item) => item.toLocaleLowerCase() === tag)) return false;
  const key = filter.frontmatterKey?.trim() ?? ""; const expected = filter.frontmatterValue?.trim() ?? "";
  if (key && !matchesValue(readFrontmatterValue(note.frontmatter, key), expected)) return false;
  return true;
}

export function filterNotePaths(paths: string[], query: string): string[] {
  const needle = query.trim().toLocaleLowerCase();
  return needle ? paths.filter((path) => path.toLocaleLowerCase().includes(needle)) : paths;
}
