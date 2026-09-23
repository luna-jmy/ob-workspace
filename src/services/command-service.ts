import type { App } from "obsidian";

interface InternalCommand { id: string; name: string }
interface InternalCommands { commands?: Record<string, InternalCommand>; executeCommandById?: (id: string) => void }

export class CommandService {
  constructor(private readonly app: App) {}
  private registry(): InternalCommands | undefined { return (this.app as unknown as { commands?: InternalCommands }).commands; }
  available(): boolean { return typeof this.registry()?.executeCommandById === "function"; }
  list(): InternalCommand[] { return Object.values(this.registry()?.commands ?? {}).sort((a, b) => a.name.localeCompare(b.name)); }
  execute(id: string): void { this.registry()?.executeCommandById?.(id); }
}
