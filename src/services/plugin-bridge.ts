import { normalizePath, TFile } from "obsidian";
import type { App, Component, TFolder } from "obsidian";
import { templatePathCandidates } from "../params/template-path";

interface DataviewApi { executeJs(code: string, container: HTMLElement, component: Component, filePath: string): Promise<void> }
interface TemplaterApi { create_new_note_from_template(template: TFile, folder?: TFolder | string, filename?: string, open?: boolean): Promise<TFile | undefined> }
interface TemplaterPlugin { templater?: TemplaterApi; settings?: { templates_folder?: unknown } }
interface PluginRegistry { plugins?: Record<string, unknown> }

export class PluginBridge {
  constructor(private readonly app: App) {}
  private plugins(): Record<string, unknown> { return (this.app as unknown as { plugins?: PluginRegistry }).plugins?.plugins ?? {}; }
  dataview(): DataviewApi | undefined {
    const plugin = this.plugins().dataview as { api?: DataviewApi } | undefined;
    return typeof plugin?.api?.executeJs === "function" ? plugin.api : undefined;
  }
  templater(): TemplaterApi | undefined {
    const plugin = this.plugins()["templater-obsidian"] as TemplaterPlugin | undefined;
    return typeof plugin?.templater?.create_new_note_from_template === "function" ? plugin.templater : undefined;
  }
  templaterTemplate(path: string): TFile | null {
    const plugin = this.plugins()["templater-obsidian"] as TemplaterPlugin | undefined;
    const folder = typeof plugin?.settings?.templates_folder === "string" ? plugin.settings.templates_folder : "";
    for (const candidate of templatePathCandidates(path, folder)) {
      const file = this.app.vault.getAbstractFileByPath(normalizePath(candidate));
      if (file instanceof TFile && file.extension === "md") return file;
    }
    return null;
  }
  templaterTemplates(): TFile[] {
    const plugin = this.plugins()["templater-obsidian"] as TemplaterPlugin | undefined;
    const folder = typeof plugin?.settings?.templates_folder === "string" ? normalizePath(plugin.settings.templates_folder) : "";
    return this.app.vault.getMarkdownFiles()
      .filter((file) => !folder || file.path === folder || file.path.startsWith(`${folder}/`))
      .sort((a, b) => a.path.localeCompare(b.path));
  }
}
