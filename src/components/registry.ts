import { Component, MarkdownRenderer, Notice, Setting, setIcon } from "obsidian";
import type CustomWorkspacePlugin from "../main";
import type { Block, ParamValue } from "../types";
import type { ParamDefinition } from "../params/parser";
import { renderFilenamePattern } from "../params/parser";
import { t } from "../i18n";
import { runScript } from "../services/script-runner";
import { moment } from "../services/date";
import { DetailModal } from "../ui/detail-modal";
import { activityLevel, areaPath, linePathRange } from "../metrics/analytics";
import { svgClasses } from "../ui/classes";
import { dailyWordChanges } from "../history/history";

function paramString(value: ParamValue | undefined, fallback = ""): string {
  return typeof value === "string" || typeof value === "number" || typeof value === "boolean" ? String(value) : fallback;
}
function paramNumber(value: ParamValue | undefined, fallback: number): number {
  if (typeof value !== "string" && typeof value !== "number") return fallback;
  const parsed = Number(value); return Number.isFinite(parsed) ? parsed : fallback;
}

export interface ComponentDefinition {
  id: string; name: string; icon: string; description: string; params: ParamDefinition[];
  render(container: HTMLElement, block: Block, host: Component, plugin: CustomWorkspacePlugin): Promise<void>;
}

const STAT_KEYS = ["notes", "attachments", "folders", "recent", "words", "links", "orphans", "empty", "short"] as const;
const DEFAULT_STAT_KEYS: StatKey[] = ["notes", "attachments", "folders", "recent", "words", "links", "orphans", "empty"];
export type StatKey = typeof STAT_KEYS[number];
export const STAT_LABELS: Record<StatKey, string> = {
  notes: "笔记", attachments: "附件", folders: "文件夹", recent: "最近新增", words: "可读字数", links: "链接", orphans: "孤立笔记", empty: "空笔记", short: "短笔记"
};
export function selectedStats(value: ParamValue | undefined): StatKey[] {
  if (!Array.isArray(value)) return [...DEFAULT_STAT_KEYS];
  const selected = value.filter((item): item is StatKey => typeof item === "string" && STAT_KEYS.includes(item as StatKey));
  return selected;
}

function metric(container: HTMLElement, label: string, value: number, paths: string[], plugin: CustomWorkspacePlugin, host: Component): void {
  const button = container.createEl("button", { cls: "cw-metric" });
  button.createSpan({ cls: "cw-metric__value", text: value.toLocaleString() });
  button.createSpan({ cls: "cw-metric__label", text: label });
  if (paths.length) { button.addClass("is-clickable"); host.registerDomEvent(button, "click", () => new DetailModal(plugin.app, label, paths, plugin).open()); }
}

const vaultStats: ComponentDefinition = {
  id: "builtin/vault-stats", name: "仓库统计", icon: "database", description: "", params: [],
  async render(container, block, host, plugin) {
    const data = await plugin.index.metrics(); await plugin.recordHistory(data);
    const grid = container.createDiv({ cls: "cw-metrics" });
    const selected = selectedStats(block.params.items);
    if (selected.includes("notes")) metric(grid, t("笔记"), data.notes, data.notePaths, plugin, host);
    if (selected.includes("attachments")) metric(grid, t("附件"), data.attachments, data.attachmentPaths, plugin, host);
    if (selected.includes("folders")) metric(grid, t("文件夹"), data.folders, data.folderPaths, plugin, host);
    if (selected.includes("recent")) metric(grid, t("最近新增"), data.recent, data.recentPaths, plugin, host);
    if (selected.includes("words")) metric(grid, t("可读字数"), data.words, data.notePaths, plugin, host);
    if (selected.includes("links")) metric(grid, t("链接"), data.links, data.linkedPaths, plugin, host);
    if (selected.includes("orphans")) metric(grid, t("孤立笔记"), data.orphanPaths.length, data.orphanPaths, plugin, host);
    if (selected.includes("empty")) metric(grid, t("空笔记"), data.emptyPaths.length, data.emptyPaths, plugin, host);
    if (selected.includes("short")) metric(grid, t("短笔记"), data.shortPaths.length, data.shortPaths, plugin, host);
  }
};

const quickJump: ComponentDefinition = {
  id: "builtin/quick-jump", name: "快速跳转", icon: "files", description: "", params: [
    { key: "limit", type: "number", defaultValue: 8 }, { key: "folder", type: "folder", defaultValue: "" },
    { key: "tag", type: "tag", defaultValue: "" }, { key: "frontmatterKey", type: "text", defaultValue: "" },
    { key: "frontmatterValue", type: "text", defaultValue: "" }
  ],
  async render(container, block, host, plugin) {
    const files = plugin.index.recentNotes(paramNumber(block.params.limit, 8), {
      folder: paramString(block.params.folder), tag: paramString(block.params.tag),
      frontmatterKey: paramString(block.params.frontmatterKey), frontmatterValue: paramString(block.params.frontmatterValue)
    });
    if (!files.length) { container.createDiv({ text: t("暂无内容"), cls: "cw-empty" }); return; }
    for (const file of files) {
      const button = container.createEl("button", { cls: "cw-note-link" });
      button.createSpan({ text: file.basename, cls: "cw-note-link__title" }); button.createEl("time", { text: moment(file.stat.mtime).format("MM-DD HH:mm"), cls: "cw-note-link__time" });
      host.registerDomEvent(button, "click", () => void plugin.app.workspace.getLeaf(false).openFile(file));
    }
  }
};

interface CommandButton { label?: ParamValue; icon?: ParamValue; command?: ParamValue; confirm?: ParamValue }
const commandButtons: ComponentDefinition = {
  id: "builtin/command-buttons", name: "命令按钮", icon: "command", description: "", params: [],
  async render(container, block, host, plugin) {
    if (!plugin.commands.available()) { unavailable(container, t("命令接口不可用")); return; }
    const buttons = Array.isArray(block.params.buttons) ? block.params.buttons as CommandButton[] : [];
    if (!buttons.length) { container.createDiv({ text: t("尚无命令按钮，请在编辑模式配置。"), cls: "cw-empty" }); return; }
    const wrapper = container.createDiv({ cls: "cw-actions cw-actions--command" });
    for (const definition of buttons) {
      const command = paramString(definition.command); const known = plugin.commands.list().some((item) => item.id === command);
      const label = paramString(definition.label).trim() || command;
      const button = wrapper.createEl("button", { text: label, cls: "cw-action-button cw-action-button--command" });
      if (definition.icon) setIcon(button.createSpan({ cls: "cw-button-icon" }), paramString(definition.icon));
      button.disabled = !known;
      host.registerDomEvent(button, "click", () => {
        if (definition.confirm && !container.ownerDocument.defaultView?.confirm(label)) return;
        plugin.commands.execute(command);
      });
    }
  }
};

interface QuickCreateButton { label?: ParamValue; template?: ParamValue; folder?: ParamValue; filename?: ParamValue; title?: ParamValue }
const templater: ComponentDefinition = {
  id: "builtin/quick-create", name: "快速新建", icon: "file-plus", description: "", params: [],
  async render(container, block, host, plugin) {
    const api = plugin.bridge.templater(); if (!api) { unavailable(container, t("需要 Templater 插件")); return; }
    const buttons = Array.isArray(block.params.buttons) ? block.params.buttons as QuickCreateButton[] : [];
    if (!buttons.length) { container.createDiv({ text: t("尚无快速新建按钮，请在编辑模式配置。"), cls: "cw-empty" }); return; }
    const wrapper = container.createDiv({ cls: "cw-actions cw-actions--create" });
    for (const definition of buttons) {
      const label = paramString(definition.label).trim() || t("快速新建");
      const button = wrapper.createEl("button", { text: label, cls: "cw-action-button cw-action-button--create" });
      host.registerDomEvent(button, "click", () => {
        const templatePath = paramString(definition.template); const template = plugin.bridge.templaterTemplate(templatePath);
        if (!template) { new Notice(`${t("找不到模板文件")}: ${templatePath || t("未配置")}`); return; }
        const filename = renderFilenamePattern(paramString(definition.filename, "{{date:YYYY-MM-DD}}"), paramString(definition.title), (format) => moment().format(format));
        void api.create_new_note_from_template(template, paramString(definition.folder), filename, true)
          .catch((error: unknown) => new Notice(error instanceof Error ? error.message : String(error)));
      });
    }
  }
};

const dataview: ComponentDefinition = {
  id: "builtin/dataview", name: "Dataview 查询", icon: "table", description: "", params: [
    { key: "code", type: "text", defaultValue: "" }, { key: "source", type: "note", defaultValue: "" }
  ],
  async render(container, block, host, plugin) {
    const api = plugin.bridge.dataview(); if (!api) { unavailable(container, t("需要 Dataview 插件")); return; }
    const code = paramString(block.params.code);
    if (!code.trim()) { unavailable(container, t("请在编辑模式配置并试运行查询")); return; }
    const configuredSource = paramString(block.params.source);
    const source = configuredSource && plugin.index.find(configuredSource) ? configuredSource : plugin.app.workspace.getActiveFile()?.path ?? "";
    await plugin.bridge.renderDataview(code, source, container, host);
  }
};

const recentCreated: ComponentDefinition = {
  id: "builtin/recent-created", name: "最近新增", icon: "sparkles", description: "", params: [
    { key: "days", type: "number", defaultValue: 30 }, { key: "limit", type: "number", defaultValue: 20 },
    { key: "folder", type: "folder", defaultValue: "" }, { key: "tag", type: "tag", defaultValue: "" },
    { key: "frontmatterKey", type: "text", defaultValue: "" }, { key: "frontmatterValue", type: "text", defaultValue: "" }
  ],
  async render(container, block, host, plugin) {
    const files = plugin.index.recentCreatedNotes(paramNumber(block.params.limit, 20), paramNumber(block.params.days, 30), {
      folder: paramString(block.params.folder), tag: paramString(block.params.tag),
      frontmatterKey: paramString(block.params.frontmatterKey), frontmatterValue: paramString(block.params.frontmatterValue)
    });
    if (!files.length) { container.createDiv({ text: t("暂无内容"), cls: "cw-empty" }); return; }
    for (const { file, created } of files) {
      const button = container.createEl("button", { cls: "cw-note-link" });
      button.createSpan({ text: file.basename, cls: "cw-note-link__title" });
      button.createEl("time", { text: moment(created).format("YYYY-MM-DD HH:mm"), cls: "cw-note-link__time" });
      host.registerDomEvent(button, "click", () => void plugin.app.workspace.getLeaf(false).openFile(file));
    }
  }
};

const baseView: ComponentDefinition = {
  id: "builtin/base", name: "Base 视图", icon: "layout-list", description: "", params: [{ key: "file", type: "note", defaultValue: "" }],
  async render(container, block, host, plugin) {
    const path = paramString(block.params.file); const file = plugin.index.find(path);
    if (!path) { unavailable(container, t("请在编辑模式选择 Base 文件")); return; }
    if (!file || file.extension !== "base") { unavailable(container, t("找不到所选 Base 文件")); return; }
    const preview = container.createDiv({ cls: "cw-base-preview" });
    await MarkdownRenderer.render(plugin.app, `![[${path}]]`, preview, plugin.app.workspace.getActiveFile()?.path ?? "", host);
    const open = container.createEl("button", { text: t("打开"), cls: "cw-link-button" });
    host.registerDomEvent(open, "click", () => void plugin.app.workspace.getLeaf(false).openFile(file));
  }
};

const wordsTrend: ComponentDefinition = {
  id: "builtin/trends", name: "每日字数变化", icon: "chart-no-axes-column-increasing", description: "", params: [],
  async render(container, _block, _host, plugin) {
    const metrics = await plugin.index.metrics(); await plugin.recordHistory(metrics);
    const history = plugin.config.showEstimatedHistory ? plugin.data.history : plugin.data.history.filter((point) => !point.estimated);
    const points = dailyWordChanges(history, moment().format("YYYY-MM-DD"), 30);
    const available = points.filter((point): point is typeof point & { words: number } => point.words !== null);
    if (!available.length) { container.createDiv({ text: t("暂无内容"), cls: "cw-empty" }); return; }
    const max = Math.max(...available.map((point) => Math.abs(point.words)), 1);
    const summary = container.createDiv({ cls: "cw-analytics-summary" }); summary.createSpan({ text: t("最近 30 天") });
    summary.createSpan({ text: t("每日净增减") });
    const frame = container.createDiv({ cls: "cw-chart-frame" });
    const yAxis = frame.createDiv({ cls: "cw-chart-y-axis" }); yAxis.createSpan({ text: `+${max.toLocaleString()}` }); yAxis.createSpan({ text: "0" }); yAxis.createSpan({ text: `−${max.toLocaleString()}` });
    const plot = frame.createDiv({ cls: "cw-chart-plot" });
    const chart = plot.createDiv({ cls: "cw-chart" });
    for (const point of points) {
      const value = point.words ?? 0; const classes = ["cw-chart__bar", value < 0 ? "is-negative" : "is-positive"];
      if (point.estimated) classes.push("is-estimated"); if (point.words === null) classes.push("is-missing");
      const column = chart.createDiv({ cls: "cw-chart__column" }); const bar = column.createDiv({ cls: classes.join(" ") });
      bar.style.setProperty("--cw-bar-height", `${Math.abs(value) / max * 50}%`);
      const label = point.words === null ? t("无可比较数据") : `${value >= 0 ? "+" : "−"}${Math.abs(value).toLocaleString()}`;
      column.setAttr("title", `${point.date}: ${label}`); column.ariaLabel = `${point.date}: ${label}`;
    }
    const xAxis = plot.createDiv({ cls: "cw-chart-x-axis" }); xAxis.createSpan({ text: points[0].date.slice(5) }); xAxis.createSpan({ text: points[Math.floor(points.length / 2)].date.slice(5) }); xAxis.createSpan({ text: points[points.length - 1].date.slice(5) });
    if (points.some((point) => point.estimated)) container.createDiv({ text: t("斜纹柱按 created 估算；连续真实快照才代表实际净变化"), cls: "cw-analytics-note" });
  }
};

const activityHeatmap: ComponentDefinition = {
  id: "builtin/activity-heatmap", name: "写作热力图", icon: "calendar-days", description: "", params: [{ key: "metric", type: "select:字数,新增笔记数", defaultValue: "字数" }],
  async render(container, block, _host, plugin) {
    const data = await plugin.index.metrics(); const useNotes = paramString(block.params.metric, "字数") === "新增笔记数";
    const values = new Map(data.heatmap.map((day) => [day.date, useNotes ? day.notes : day.words]));
    const maximum = Math.max(0, ...values.values()); const total = [...values.values()].reduce((sum, value) => sum + value, 0);
    const summary = container.createDiv({ cls: "cw-analytics-summary" });
    summary.createSpan({ text: t("过去 12 个月") }); summary.createSpan({ text: `${total.toLocaleString()} ${useNotes ? t("篇笔记") : t("字")}` });
    const explanation = useNotes ? t("新增笔记优先使用 created，缺失时使用文件创建时间") : t("按系统修改日期归组当前字数");
    const unit = useNotes ? t("篇") : t("字");
    const grid = container.createDiv({ cls: `cw-heatmap${block.span === 3 ? " cw-heatmap--square" : ""}`, attr: { role: "img", "aria-label": explanation } });
    const end = moment().startOf("day"); const start = end.clone().subtract(364, "days");
    for (let index = 0; index < start.day(); index += 1) grid.createSpan({ cls: "cw-heatmap__blank", attr: { "aria-hidden": "true" } });
    for (let index = 0; index < 365; index += 1) {
      const date = start.clone().add(index, "days").format("YYYY-MM-DD"); const count = values.get(date) ?? 0;
      grid.createSpan({ cls: `cw-heatmap__day cw-heatmap__day--${activityLevel(count, maximum)}`, attr: { title: `${date}: ${count.toLocaleString()} ${unit}`, "aria-label": `${date}: ${count.toLocaleString()} ${unit}` } });
    }
    const footer = container.createDiv({ cls: "cw-heatmap-legend" }); footer.createSpan({ text: t("少") });
    for (let level = 1; level <= 5; level += 1) footer.createSpan({ cls: `cw-heatmap__day cw-heatmap__day--${level}`, attr: { "aria-hidden": "true" } });
    footer.createSpan({ text: t("多") }); container.createDiv({ text: explanation, cls: "cw-analytics-note" });
  }
};

const linkTrend: ComponentDefinition = {
  id: "builtin/link-trend", name: "双链统计图", icon: "link-2", description: "", params: [{ key: "range", type: "select:90,180,365", defaultValue: "365" }],
  async render(container, block, _host, plugin) {
    const metrics = await plugin.index.metrics(); await plugin.recordHistory(metrics);
    const range = Math.max(1, paramNumber(block.params.range, 365));
    const cutoff = moment().subtract(range - 1, "days").format("YYYY-MM-DD");
    const history = (plugin.config.showEstimatedHistory ? plugin.data.history : plugin.data.history.filter((point) => !point.estimated)).filter((point) => point.date >= cutoff);
    if (!history.length) { container.createDiv({ text: t("暂无内容"), cls: "cw-empty" }); return; }
    const values = history.map((point) => point.links); const maximum = Math.max(1, ...values); const last = history[history.length - 1];
    const summary = container.createDiv({ cls: "cw-analytics-summary" }); summary.createSpan({ text: `${range} ${t("天")}` }); summary.createSpan({ text: last.links.toLocaleString() });
    const frame = container.createDiv({ cls: "cw-link-chart-frame" });
    const yAxis = frame.createDiv({ cls: "cw-link-chart-y" }); yAxis.createSpan({ text: maximum.toLocaleString() }); yAxis.createSpan({ text: Math.round(maximum / 2).toLocaleString() }); yAxis.createSpan({ text: "0" });
    const plot = frame.createDiv({ cls: "cw-link-chart-plot" });
    const svg = plot.createSvg("svg", { cls: "cw-link-chart", attr: { viewBox: "0 0 100 48", preserveAspectRatio: "none", role: "img", "aria-label": t("已解析内部链接总量") } });
    svg.createSvg("line", { cls: "cw-link-chart__grid", attr: { x1: "0", y1: "0", x2: "100", y2: "0" } });
    svg.createSvg("line", { cls: "cw-link-chart__grid", attr: { x1: "0", y1: "24", x2: "100", y2: "24" } });
    svg.createSvg("line", { cls: "cw-link-chart__grid", attr: { x1: "0", y1: "48", x2: "100", y2: "48" } });
    svg.createSvg("path", { cls: "cw-link-chart__area", attr: { d: areaPath(values, maximum) } });
    let lastEstimated = -1; history.forEach((point, index) => { if (point.estimated) lastEstimated = index; });
    if (lastEstimated >= 0) svg.createSvg("path", { cls: svgClasses("cw-link-chart__line", "is-estimated"), attr: { d: linePathRange(values, maximum, 0, lastEstimated) } });
    const actualStart = Math.max(0, history.findIndex((point) => !point.estimated) - 1);
    if (history.some((point) => !point.estimated)) svg.createSvg("path", { cls: "cw-link-chart__line", attr: { d: linePathRange(values, maximum, actualStart, history.length - 1) } });
    svg.createSvg("circle", { cls: "cw-link-chart__point", attr: { cx: "100", cy: String(48 - last.links / maximum * 48), r: "1.2" } });
    const xAxis = plot.createDiv({ cls: "cw-link-chart-x" }); xAxis.createSpan({ text: history[0].date.slice(5) }); xAxis.createSpan({ text: last.date.slice(5) });
    if (history.some((point) => point.estimated)) container.createDiv({ text: t("虚线按 created 估算笔记出现时间，无法还原链接实际添加日期"), cls: "cw-analytics-note" });
  }
};

const structureAnalysis: ComponentDefinition = {
  id: "builtin/structure", name: "知识库结构分析", icon: "folders", description: "", params: [],
  async render(container, _block, host, plugin) {
    const data = await plugin.index.metrics();
    if (!data.topFolders.length) { container.createDiv({ text: t("暂无内容"), cls: "cw-empty" }); return; }
    container.createDiv({ text: t("按一级目录统计 Markdown 笔记"), cls: "cw-analytics-note cw-analytics-note--top" });
    const maximum = Math.max(1, ...data.topFolders.map((folder) => folder.notes)); const grid = container.createDiv({ cls: "cw-structure" });
    for (const folder of data.topFolders) {
      const label = folder.name || t("根目录"); const row = grid.createEl("button", { cls: "cw-structure__row", attr: { "aria-label": `${label}: ${folder.notes} ${t("篇")}` } });
      setIcon(row.createSpan({ cls: "cw-structure__icon" }), "folder"); const content = row.createSpan({ cls: "cw-structure__content" });
      const heading = content.createSpan({ cls: "cw-structure__heading" }); heading.createSpan({ text: label, cls: "cw-structure__name" });
      const figures = heading.createSpan({ cls: "cw-structure__figures" }); figures.createSpan({ text: `${folder.notes.toLocaleString()} ${t("篇")}` }); figures.createSpan({ text: `${new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 }).format(folder.words)} ${t("字")}` });
      const track = content.createSpan({ cls: "cw-structure__track" }); const bar = track.createSpan({ cls: "cw-structure__bar" }); bar.style.setProperty("--cw-structure-width", `${folder.notes / maximum * 100}%`);
      setIcon(row.createSpan({ cls: "cw-structure__chevron" }), "chevron-right"); host.registerDomEvent(row, "click", () => new DetailModal(plugin.app, label, folder.paths, plugin).open());
    }
  }
};

const todayTasks: ComponentDefinition = {
  id: "builtin/today-tasks", name: "今日任务", icon: "list-checks", description: "", params: [],
  async render(container, _block, host, plugin) { await plugin.renderTasks(container, host); }
};

const BUILTINS = [vaultStats, todayTasks, quickJump, recentCreated, commandButtons, wordsTrend, activityHeatmap, linkTrend, structureAnalysis, templater, baseView, dataview];

export function builtinDefinitions(): ComponentDefinition[] { return BUILTINS; }
export function builtinById(id: string): ComponentDefinition | undefined { return BUILTINS.find((definition) => definition.id === id); }
export function componentName(definition: ComponentDefinition): string {
  const names: Record<string, string> = {
    "builtin/vault-stats": t("仓库统计"), "builtin/today-tasks": t("今日任务"), "builtin/quick-jump": t("快速跳转"),
    "builtin/command-buttons": t("命令按钮"), "builtin/trends": t("每日字数变化"), "builtin/activity-heatmap": t("写作热力图"),
    "builtin/link-trend": t("双链统计图"), "builtin/structure": t("知识库结构分析"), "builtin/quick-create": t("快速新建"), "builtin/base": t("Base 视图"),
    "builtin/dataview": t("Dataview 查询"), "builtin/recent-created": t("最近新增")
  };
  return names[definition.id] ?? definition.name;
}

export function scriptDefinition(filename: string, name: string, icon: string, description: string, params: ParamDefinition[]): ComponentDefinition {
  return { id: `script/${filename}`, name, icon, description, params, async render(container, block, host, plugin) {
    if (!plugin.config.allowScripts) { unavailable(container, t("已在设置里关闭脚本执行")); return; }
    const body = await plugin.readScript(filename);
    await runScript(body, { app: plugin.app, container, params: block.params, moment, component: host,
      size: { width: container.clientWidth, height: container.clientHeight } });
  } };
}

export function addParamSetting(parent: HTMLElement, definition: ParamDefinition, block: Block, onChange: () => Promise<void>): void {
  const labels: Record<string, string> = {
    limit: t("显示条数"), days: t("最近天数"), folder: t("目录"), tag: t("标签"), frontmatterKey: t("Frontmatter 属性名"),
    frontmatterValue: t("Frontmatter 属性值"), metric: t("统计方式"), range: t("统计范围")
  };
  const optionLabels: Record<string, string> = { "字数": t("字数"), "新增笔记数": t("新增笔记数") };
  const setting = new Setting(parent).setName(labels[definition.key] ?? definition.key);
  const value = block.params[definition.key] ?? definition.defaultValue;
  if (definition.type === "boolean") setting.addToggle((toggle) => toggle.setValue(Boolean(value)).onChange(async (next) => { block.params[definition.key] = next; await onChange(); }));
  else if (definition.type === "number") setting.addText((text) => text.setValue(paramString(value, "0")).onChange(async (next) => { const parsed = Number(next); if (Number.isFinite(parsed)) { block.params[definition.key] = parsed; await onChange(); } }));
  else if (definition.type.startsWith("select:")) setting.addDropdown((dropdown) => {
    for (const option of definition.type.slice(7).split(",")) dropdown.addOption(option, optionLabels[option] ?? option);
    dropdown.setValue(paramString(value)).onChange(async (next) => { block.params[definition.key] = next; await onChange(); });
  });
  else setting.addText((text) => text.setValue(paramString(value)).setPlaceholder(t("请输入值")).onChange(async (next) => { block.params[definition.key] = next; await onChange(); }));
}

function unavailable(container: HTMLElement, message: string): void { container.createDiv({ text: message, cls: "cw-unavailable" }); }
