import type { ParamValue } from "../types";

export type ParamType = "text" | "number" | "boolean" | "folder" | "note" | "tag" | `select:${string}`;
export interface ParamDefinition { key: string; type: ParamType; defaultValue: ParamValue }
export interface ScriptMetadata { name: string; icon: string; description: string; params: ParamDefinition[] }

export function parseScriptMetadata(source: string, filename: string): ScriptMetadata {
  const name = directive(source, "name") ?? filename.replace(/\.js$/i, "");
  const icon = directive(source, "icon") ?? "file-code";
  const description = directive(source, "desc") ?? "";
  const params: ParamDefinition[] = [];
  for (const match of source.matchAll(/^\/\/\s*cw:param=([\w-]+):([^|\s]+)(?:\|(.*))?$/gm)) {
    const type = match[2] as ParamType;
    if (!isParamType(type)) continue;
    params.push({ key: match[1], type, defaultValue: parseDefault(type, match[3] ?? "") });
  }
  return { name, icon, description, params };
}

function directive(source: string, key: string): string | undefined {
  return source.match(new RegExp(`^//\\s*cw:${key}=(.*)$`, "m"))?.[1]?.trim();
}

function isParamType(type: string): type is ParamType {
  return ["text", "number", "boolean", "folder", "note", "tag"].includes(type) || /^select:.+/.test(type);
}

function parseDefault(type: ParamType, value: string): ParamValue {
  if (type === "number") return Number.isFinite(Number(value)) ? Number(value) : 0;
  if (type === "boolean") return value === "true";
  return value;
}

export function withParamDefaults(definitions: ParamDefinition[], values: Record<string, ParamValue>): Record<string, ParamValue> {
  return Object.fromEntries(definitions.map((definition) => [definition.key, values[definition.key] ?? definition.defaultValue]));
}

export function renderFilenamePattern(pattern: string, title: string, formatDate: (format: string) => string): string {
  return pattern.replace(/{{date(?::([^}]+))?}}/g, (_all, format: string | undefined) => formatDate(format ?? "YYYY-MM-DD"))
    .replaceAll("{{title}}", title).replace(/[\\/:*?"<>|]/g, "-").trim();
}
