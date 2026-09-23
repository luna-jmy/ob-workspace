export type ParamValue = string | number | boolean | ParamValue[] | { [key: string]: ParamValue };
export type BlockSpan = 3 | 4 | 6 | 12;

export interface Block {
  id: string;
  componentId: string;
  span: BlockSpan;
  title?: string;
  params: Record<string, ParamValue>;
}

export interface DailySnapshot {
  date: string;
  notes: number;
  links: number;
  words: number;
  estimated?: true;
}

export interface WorkspaceSettings {
  language: "auto" | "zh" | "en";
  density: "comfortable" | "compact";
  autoOpen: boolean;
  autoOpenMode: "new-tab" | "replace";
  journalFolder: string;
  dateFormat: string;
  excludedFolders: string[];
  shortNoteThreshold: number;
  recentDays: number;
  showEstimatedHistory: boolean;
  allowScripts: boolean;
}

export interface CustomWorkspaceData {
  version: number;
  settings: WorkspaceSettings;
  workspace: { blocks: Block[] };
  history: DailySnapshot[];
  historyInitialized: boolean;
}

export const DEFAULT_SETTINGS: WorkspaceSettings = {
  language: "auto", density: "comfortable", autoOpen: true, autoOpenMode: "new-tab",
  journalFolder: "", dateFormat: "YYYY-MM-DD", excludedFolders: [], shortNoteThreshold: 10,
  recentDays: 7, showEstimatedHistory: true, allowScripts: false
};

export const DEFAULT_DATA: CustomWorkspaceData = {
  version: 3,
  settings: DEFAULT_SETTINGS,
  workspace: { blocks: [
    { id: "default-stats", componentId: "builtin/vault-stats", span: 12, params: {} },
    { id: "default-tasks", componentId: "builtin/today-tasks", span: 12, params: {} },
    { id: "default-jump", componentId: "builtin/quick-jump", span: 12, params: { limit: 8 } },
    { id: "default-commands", componentId: "builtin/command-buttons", span: 12, params: { buttons: [] } }
  ] },
  history: [], historyInitialized: false
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function mergeSettings(value: unknown): WorkspaceSettings {
  if (!isRecord(value)) return { ...DEFAULT_SETTINGS };
  const result = { ...DEFAULT_SETTINGS };
  if (["auto", "zh", "en"].includes(String(value.language))) result.language = value.language as WorkspaceSettings["language"];
  if (["comfortable", "compact"].includes(String(value.density))) result.density = value.density as WorkspaceSettings["density"];
  if (typeof value.autoOpen === "boolean") result.autoOpen = value.autoOpen;
  if (["new-tab", "replace"].includes(String(value.autoOpenMode))) result.autoOpenMode = value.autoOpenMode as WorkspaceSettings["autoOpenMode"];
  if (typeof value.journalFolder === "string") result.journalFolder = value.journalFolder;
  if (typeof value.dateFormat === "string" && value.dateFormat) result.dateFormat = value.dateFormat;
  if (Array.isArray(value.excludedFolders)) result.excludedFolders = value.excludedFolders.filter((x): x is string => typeof x === "string");
  if (typeof value.shortNoteThreshold === "number" && value.shortNoteThreshold >= 0) result.shortNoteThreshold = value.shortNoteThreshold;
  if (typeof value.recentDays === "number" && value.recentDays > 0) result.recentDays = value.recentDays;
  if (typeof value.showEstimatedHistory === "boolean") result.showEstimatedHistory = value.showEstimatedHistory;
  if (typeof value.allowScripts === "boolean") result.allowScripts = value.allowScripts;
  return result;
}

export function migrateData(value: unknown): CustomWorkspaceData {
  if (!isRecord(value)) return structuredClone(DEFAULT_DATA);
  const workspace = isRecord(value.workspace) && Array.isArray(value.workspace.blocks)
    ? { blocks: value.workspace.blocks.filter(isBlock).filter((block) => block.componentId !== "builtin/graph").map(migrateBlock) } : structuredClone(DEFAULT_DATA.workspace);
  const history = Array.isArray(value.history) ? value.history.filter(isSnapshot) : [];
  return { version: 3, settings: mergeSettings(value.settings), workspace, history,
    historyInitialized: typeof value.historyInitialized === "boolean" ? value.historyInitialized : history.length > 0 };
}

function migrateBlock(block: Block): Block {
  if (block.componentId !== "builtin/note-health") return block;
  return { ...block, componentId: "builtin/vault-stats", params: { ...block.params, items: ["orphans", "empty", "short"] } };
}

function isBlock(value: unknown): value is Block {
  return isRecord(value) && typeof value.id === "string" && typeof value.componentId === "string"
    && [3, 4, 6, 12].includes(Number(value.span)) && isRecord(value.params);
}

function isSnapshot(value: unknown): value is DailySnapshot {
  return isRecord(value) && typeof value.date === "string" && typeof value.notes === "number"
    && typeof value.links === "number" && typeof value.words === "number";
}
