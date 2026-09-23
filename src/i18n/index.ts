import { en } from "./en";
import type { WorkspaceSettings } from "../types";
import { moment } from "../services/date";

let language: WorkspaceSettings["language"] = "auto";
export function setLanguage(value: WorkspaceSettings["language"]): void { language = value; }
export function t(key: string): string {
  const current = language === "auto" ? moment.locale() : language;
  return current.toLowerCase().startsWith("zh") ? key : (en[key] ?? key);
}
