import type { App, Component, TFile, TFolder } from "obsidian";

interface DataviewApi { executeJs(code: string, container: HTMLElement, component: Component, filePath: string): Promise<void> }
interface TemplaterApi { create_new_note_from_template(template: TFile | string, folder?: TFolder | string, filename?: string, open?: boolean): Promise<TFile | undefined> }
interface PluginRegistry { plugins?: Record<string, unknown> }

export class PluginBridge {
  constructor(private readonly app: App) {}
  private plugins(): Record<string, unknown> { return (this.app as unknown as { plugins?: PluginRegistry }).plugins?.plugins ?? {}; }
  dataview(): DataviewApi | undefined {
    const plugin = this.plugins().dataview as { api?: DataviewApi } | undefined;
    return typeof plugin?.api?.executeJs === "function" ? plugin.api : undefined;
  }
  templater(): TemplaterApi | undefined {
    const plugin = this.plugins()["templater-obsidian"] as { templater?: TemplaterApi } | undefined;
    return typeof plugin?.templater?.create_new_note_from_template === "function" ? plugin.templater : undefined;
  }
}
