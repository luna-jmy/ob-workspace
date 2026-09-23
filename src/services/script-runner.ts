import type { App, Component } from "obsidian";
import type { ParamValue } from "../types";
import { moment } from "./date";

export interface ScriptContext {
  app: App; container: HTMLElement; params: Record<string, ParamValue>; moment: typeof moment;
  component: Component; size: { width: number; height: number };
}

export async function runScript(body: string, context: ScriptContext): Promise<void> {
  const execute = new Function("ctx", `return (async () => {\n${body}\n})()`) as unknown as (ctx: ScriptContext) => Promise<void>;
  await execute(context);
}
