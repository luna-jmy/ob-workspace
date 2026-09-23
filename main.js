var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => CustomWorkspacePlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian7 = require("obsidian");

// src/settings.ts
var import_obsidian2 = require("obsidian");

// src/i18n/en.ts
var en = {
  "\u81EA\u5B9A\u4E49\u5DE5\u4F5C\u53F0": "Custom Workspace",
  "\u6253\u5F00\u5DE5\u4F5C\u53F0": "Open workspace",
  "\u5207\u6362\u7F16\u8F91\u6A21\u5F0F": "Toggle edit mode",
  "\u7F16\u8F91\u6A21\u5F0F": "Edit mode",
  "\u6DFB\u52A0\u7EC4\u4EF6": "Add component",
  "\u4ED3\u5E93\u7EDF\u8BA1": "Vault stats",
  "\u4ECA\u65E5\u4EFB\u52A1": "Today's tasks",
  "\u5FEB\u901F\u8DF3\u8F6C": "Quick jump",
  "\u547D\u4EE4\u6309\u94AE": "Command buttons",
  "\u7B14\u8BB0\u5065\u5EB7\u5EA6": "Note health",
  "\u5B57\u6570\u4E0E\u8D8B\u52BF": "Words & trends",
  "\u77E5\u8BC6\u56FE\u8C31": "Graph",
  "\u5FEB\u901F\u65B0\u5EFA": "Quick create",
  "Base \u89C6\u56FE": "Base view",
  "Dataview \u67E5\u8BE2": "Dataview query",
  "\u7B14\u8BB0": "Notes",
  "\u9644\u4EF6": "Attachments",
  "\u6587\u4EF6\u5939": "Folders",
  "\u6700\u8FD1\u65B0\u589E": "Recently created",
  "\u53EF\u8BFB\u5B57\u6570": "Readable words",
  "\u94FE\u63A5": "Links",
  "\u5B64\u7ACB\u7B14\u8BB0": "Orphan notes",
  "\u7A7A\u7B14\u8BB0": "Empty notes",
  "\u77ED\u7B14\u8BB0": "Short notes",
  "\u4ECA\u5929": "Today",
  "\u9057\u7559": "Overdue",
  "\u6700\u8FD1\u5B8C\u6210": "Recently completed",
  "\u6682\u65E0\u5185\u5BB9": "Nothing here yet",
  "\u52A0\u8F7D\u4E2D\u2026": "Loading\u2026",
  "\u91CD\u8BD5": "Retry",
  "\u914D\u7F6E": "Configure",
  "\u5220\u9664": "Delete",
  "\u6807\u9898": "Title",
  "\u663E\u793A\u540D": "Label",
  "\u547D\u4EE4": "Command",
  "\u8BF7\u9009\u62E9\u547D\u4EE4": "Select a command",
  "\u8981\u786E\u8BA4": "Require confirmation",
  "\u6DFB\u52A0\u6309\u94AE": "Add button",
  "\u4EE3\u7801": "Code",
  "\u8BD5\u8FD0\u884C\u5E76\u4FDD\u5B58": "Test and save",
  "\u8BD5\u8FD0\u884C\u6210\u529F\uFF0C\u5DF2\u4FDD\u5B58\u3002": "Test succeeded and was saved.",
  "\u4E0A\u79FB": "Move up",
  "\u4E0B\u79FB": "Move down",
  "\u6574\u884C": "Full width",
  "\u534A\u884C": "Half width",
  "\u4E09\u5206\u4E4B\u4E00": "One third",
  "\u9700\u8981 Dataview \u63D2\u4EF6": "Requires the Dataview plugin",
  "\u9700\u8981 Templater \u63D2\u4EF6": "Requires the Templater plugin",
  "\u547D\u4EE4\u63A5\u53E3\u4E0D\u53EF\u7528": "Command interface unavailable",
  "\u5DF2\u5728\u8BBE\u7F6E\u91CC\u5173\u95ED\u811A\u672C\u6267\u884C": "Script execution is disabled in settings",
  "\u754C\u9762\u8BED\u8A00": "Interface language",
  "\u8DDF\u968F Obsidian": "Follow Obsidian",
  "\u4E2D\u6587": "Chinese",
  "\u82F1\u6587": "English",
  "\u6392\u7248\u5BC6\u5EA6": "Layout density",
  "\u5BBD\u677E": "Comfortable",
  "\u7D27\u51D1": "Compact",
  "\u542F\u52A8\u65F6\u81EA\u52A8\u6253\u5F00": "Open at startup",
  "\u81EA\u52A8\u6253\u5F00\u65B9\u5F0F": "Startup opening mode",
  "\u65B0\u6807\u7B7E\u9875": "New tab",
  "\u66FF\u6362\u5F53\u524D\u6807\u7B7E\u9875": "Replace current tab",
  "\u65E5\u5FD7\u76EE\u5F55": "Journal folder",
  "\u65E5\u671F\u683C\u5F0F": "Date format",
  "\u6392\u9664\u76EE\u5F55": "Excluded folders",
  "\u7A7A/\u77ED\u7B14\u8BB0\u9608\u503C": "Empty/short note threshold",
  "\u6700\u8FD1\u5929\u6570": "Recent days",
  "\u663E\u793A\u4F30\u7B97\u5386\u53F2": "Show estimated history",
  "\u5141\u8BB8\u6267\u884C\u81EA\u5B9A\u4E49\u811A\u672C": "Allow custom scripts",
  "\u811A\u672C\u53EF\u4EE5\u8BFB\u5199\u4F60\u7684 vault\uFF0C\u53EA\u8FD0\u884C\u4F60\u4FE1\u4EFB\u7684\u4EE3\u7801\u3002": "Scripts can read and write your vault. Only run code you trust.",
  "\u811A\u672C\u76EE\u5F55": "Script directory",
  "\u65B0\u5EFA\u811A\u672C": "New script",
  "\u5DF2\u65B0\u5EFA\u811A\u672C": "Script created",
  "\u5DE5\u4F5C\u53F0\u6570\u636E\u53EA\u5B58\u5728\u63D2\u4EF6\u76EE\u5F55\uFF1B\u6362\u673A\u5668\u6216\u5378\u8F7D\u524D\u8BF7\u81EA\u884C\u5907\u4EFD\u3002": "Workspace data only exists in the plugin directory. Back it up before moving devices or uninstalling.",
  "\u6E05\u7A7A\u5386\u53F2": "Clear history",
  "\u6E05\u7A7A": "Clear",
  "\u5C1A\u65E0\u547D\u4EE4\u6309\u94AE\uFF0C\u8BF7\u5728\u7F16\u8F91\u6A21\u5F0F\u914D\u7F6E\u3002": "No command buttons yet. Configure them in edit mode.",
  "\u6253\u5F00": "Open",
  "\u7EC4\u4EF6\u4E0D\u53EF\u7528": "Component unavailable",
  "\u672A\u77E5\u7EC4\u4EF6": "Unknown component",
  "\u8BF7\u8F93\u5165\u503C": "Enter a value"
};

// src/services/date.ts
var import_obsidian = require("obsidian");
var moment = import_obsidian.moment;

// src/i18n/index.ts
var language = "auto";
function setLanguage(value) {
  language = value;
}
function t(key) {
  var _a;
  const current = language === "auto" ? moment.locale() : language;
  return current.toLowerCase().startsWith("zh") ? key : (_a = en[key]) != null ? _a : key;
}

// src/settings.ts
var CustomWorkspaceSettingTab = class extends import_obsidian2.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    this.containerEl.empty();
    new import_obsidian2.Setting(this.containerEl).setName(t("\u754C\u9762\u8BED\u8A00")).addDropdown((dropdown) => dropdown.addOption("auto", t("\u8DDF\u968F Obsidian")).addOption("zh", t("\u4E2D\u6587")).addOption("en", t("\u82F1\u6587")).setValue(this.plugin.config.language).onChange(async (value) => {
      this.plugin.config.language = value;
      setLanguage(this.plugin.config.language);
      await this.plugin.persist();
      this.display();
    }));
    new import_obsidian2.Setting(this.containerEl).setName(t("\u6392\u7248\u5BC6\u5EA6")).addDropdown((dropdown) => dropdown.addOption("comfortable", t("\u5BBD\u677E")).addOption("compact", t("\u7D27\u51D1")).setValue(this.plugin.config.density).onChange(async (value) => {
      this.plugin.config.density = value;
      await this.plugin.persist();
      this.plugin.refreshViews();
    }));
    new import_obsidian2.Setting(this.containerEl).setName(t("\u542F\u52A8\u65F6\u81EA\u52A8\u6253\u5F00")).addToggle((toggle) => toggle.setValue(this.plugin.config.autoOpen).onChange(async (value) => {
      this.plugin.config.autoOpen = value;
      await this.plugin.persist();
    }));
    new import_obsidian2.Setting(this.containerEl).setName(t("\u81EA\u52A8\u6253\u5F00\u65B9\u5F0F")).addDropdown((dropdown) => dropdown.addOption("new-tab", t("\u65B0\u6807\u7B7E\u9875")).addOption("replace", t("\u66FF\u6362\u5F53\u524D\u6807\u7B7E\u9875")).setValue(this.plugin.config.autoOpenMode).onChange(async (value) => {
      this.plugin.config.autoOpenMode = value;
      await this.plugin.persist();
    }));
    textSetting(this.containerEl, t("\u65E5\u5FD7\u76EE\u5F55"), this.plugin.config.journalFolder, async (value) => {
      this.plugin.config.journalFolder = value;
      await this.plugin.persist();
    });
    textSetting(this.containerEl, t("\u65E5\u671F\u683C\u5F0F"), this.plugin.config.dateFormat, async (value) => {
      this.plugin.config.dateFormat = value || "YYYY-MM-DD";
      await this.plugin.persist();
    });
    textSetting(this.containerEl, t("\u6392\u9664\u76EE\u5F55"), this.plugin.config.excludedFolders.join(", "), async (value) => {
      this.plugin.config.excludedFolders = value.split(",").map((item) => item.trim()).filter(Boolean);
      this.plugin.index.invalidate();
      await this.plugin.persist();
    });
    numberSetting(this.containerEl, t("\u7A7A/\u77ED\u7B14\u8BB0\u9608\u503C"), this.plugin.config.shortNoteThreshold, async (value) => {
      this.plugin.config.shortNoteThreshold = value;
      this.plugin.index.invalidate();
      await this.plugin.persist();
    });
    numberSetting(this.containerEl, t("\u6700\u8FD1\u5929\u6570"), this.plugin.config.recentDays, async (value) => {
      this.plugin.config.recentDays = value;
      this.plugin.index.invalidate();
      await this.plugin.persist();
    });
    new import_obsidian2.Setting(this.containerEl).setName(t("\u663E\u793A\u4F30\u7B97\u5386\u53F2")).addToggle((toggle) => toggle.setValue(this.plugin.config.showEstimatedHistory).onChange(async (value) => {
      this.plugin.config.showEstimatedHistory = value;
      await this.plugin.persist();
      this.plugin.refreshViews();
    }));
    new import_obsidian2.Setting(this.containerEl).setName(t("\u5141\u8BB8\u6267\u884C\u81EA\u5B9A\u4E49\u811A\u672C")).setDesc(t("\u811A\u672C\u53EF\u4EE5\u8BFB\u5199\u4F60\u7684 vault\uFF0C\u53EA\u8FD0\u884C\u4F60\u4FE1\u4EFB\u7684\u4EE3\u7801\u3002")).addToggle((toggle) => toggle.setValue(this.plugin.config.allowScripts).onChange(async (value) => {
      this.plugin.config.allowScripts = value;
      await this.plugin.persist();
      await this.plugin.reloadScripts();
      this.plugin.refreshViews();
    }));
    new import_obsidian2.Setting(this.containerEl).setName(t("\u811A\u672C\u76EE\u5F55")).setDesc(this.plugin.scriptDirectory()).addButton((button) => button.setButtonText(t("\u65B0\u5EFA\u811A\u672C")).onClick(() => this.plugin.createScript()));
    new import_obsidian2.Setting(this.containerEl).setName(t("\u6E05\u7A7A\u5386\u53F2")).setDesc(t("\u5DE5\u4F5C\u53F0\u6570\u636E\u53EA\u5B58\u5728\u63D2\u4EF6\u76EE\u5F55\uFF1B\u6362\u673A\u5668\u6216\u5378\u8F7D\u524D\u8BF7\u81EA\u884C\u5907\u4EFD\u3002")).addButton((button) => button.setButtonText(t("\u6E05\u7A7A")).onClick(async () => {
      this.plugin.data.history = [];
      this.plugin.data.historyInitialized = true;
      await this.plugin.persist();
    }));
  }
};
function textSetting(container, name, value, change) {
  new import_obsidian2.Setting(container).setName(name).addText((text) => text.setValue(value).onChange(change));
}
function numberSetting(container, name, value, change) {
  new import_obsidian2.Setting(container).setName(name).addText((text) => text.setValue(String(value)).onChange(async (next) => {
    const parsed = Number(next);
    if (Number.isFinite(parsed) && parsed >= 0) await change(parsed);
  }));
}

// src/views/workspace-view.ts
var import_obsidian5 = require("obsidian");

// src/render/workspace-renderer.ts
var import_obsidian4 = require("obsidian");

// src/components/registry.ts
var import_obsidian3 = require("obsidian");

// src/params/parser.ts
function parseScriptMetadata(source, filename) {
  var _a, _b, _c, _d;
  const name = (_a = directive(source, "name")) != null ? _a : filename.replace(/\.js$/i, "");
  const icon = (_b = directive(source, "icon")) != null ? _b : "file-code";
  const description = (_c = directive(source, "desc")) != null ? _c : "";
  const params = [];
  for (const match of source.matchAll(/^\/\/\s*cw:param=([\w-]+):([^|\s]+)(?:\|(.*))?$/gm)) {
    const type = match[2];
    if (!isParamType(type)) continue;
    params.push({ key: match[1], type, defaultValue: parseDefault(type, (_d = match[3]) != null ? _d : "") });
  }
  return { name, icon, description, params };
}
function directive(source, key) {
  var _a, _b;
  return (_b = (_a = source.match(new RegExp(`^//\\s*cw:${key}=(.*)$`, "m"))) == null ? void 0 : _a[1]) == null ? void 0 : _b.trim();
}
function isParamType(type) {
  return ["text", "number", "boolean", "folder", "note", "tag"].includes(type) || /^select:.+/.test(type);
}
function parseDefault(type, value) {
  if (type === "number") return Number.isFinite(Number(value)) ? Number(value) : 0;
  if (type === "boolean") return value === "true";
  return value;
}
function renderFilenamePattern(pattern, title, formatDate) {
  return pattern.replace(/{{date(?::([^}]+))?}}/g, (_all, format) => formatDate(format != null ? format : "YYYY-MM-DD")).replaceAll("{{title}}", title).replace(/[\\/:*?"<>|]/g, "-").trim();
}

// src/services/script-runner.ts
async function runScript(body, context) {
  const execute = new Function("ctx", `return (async () => {
${body}
})()`);
  await execute(context);
}

// src/components/registry.ts
function paramString(value, fallback = "") {
  return typeof value === "string" || typeof value === "number" || typeof value === "boolean" ? String(value) : fallback;
}
function paramNumber(value, fallback) {
  if (typeof value !== "string" && typeof value !== "number") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}
function metric(container, label, value, paths, plugin) {
  const button = container.createEl("button", { cls: "cw-metric" });
  button.createSpan({ cls: "cw-metric__value", text: value.toLocaleString() });
  button.createSpan({ cls: "cw-metric__label", text: label });
  if (paths.length) button.addEventListener("click", () => showPaths(container, paths, plugin));
}
function showPaths(container, paths, plugin) {
  const existing = container.querySelector(".cw-detail");
  existing == null ? void 0 : existing.remove();
  const list = container.createDiv({ cls: "cw-detail" });
  for (const path of paths.slice(0, 100)) {
    const item = list.createEl("button", { text: path, cls: "cw-link-button" });
    item.addEventListener("click", () => {
      const file = plugin.index.find(path);
      if (file) void plugin.app.workspace.getLeaf(false).openFile(file);
    });
  }
}
var vaultStats = {
  id: "builtin/vault-stats",
  name: "\u4ED3\u5E93\u7EDF\u8BA1",
  icon: "database",
  description: "",
  params: [],
  async render(container, _block, _host, plugin) {
    const data = await plugin.index.metrics();
    await plugin.recordHistory(data);
    const grid = container.createDiv({ cls: "cw-metrics" });
    metric(grid, t("\u7B14\u8BB0"), data.notes, [], plugin);
    metric(grid, t("\u9644\u4EF6"), data.attachments, [], plugin);
    metric(grid, t("\u6587\u4EF6\u5939"), data.folders, [], plugin);
    metric(grid, t("\u6700\u8FD1\u65B0\u589E"), data.recent, [], plugin);
    metric(grid, t("\u53EF\u8BFB\u5B57\u6570"), data.words, [], plugin);
    metric(grid, t("\u94FE\u63A5"), data.links, [], plugin);
    metric(grid, t("\u5B64\u7ACB\u7B14\u8BB0"), data.orphanPaths.length, data.orphanPaths, plugin);
    metric(grid, t("\u7A7A\u7B14\u8BB0"), data.emptyPaths.length, data.emptyPaths, plugin);
  }
};
var quickJump = {
  id: "builtin/quick-jump",
  name: "\u5FEB\u901F\u8DF3\u8F6C",
  icon: "files",
  description: "",
  params: [
    { key: "limit", type: "number", defaultValue: 8 },
    { key: "folder", type: "folder", defaultValue: "" }
  ],
  async render(container, block, _host, plugin) {
    const files = plugin.index.recentNotes(paramNumber(block.params.limit, 8), paramString(block.params.folder));
    if (!files.length) {
      container.createDiv({ text: t("\u6682\u65E0\u5185\u5BB9"), cls: "cw-empty" });
      return;
    }
    for (const file of files) {
      const button = container.createEl("button", { cls: "cw-note-link" });
      button.createSpan({ text: file.basename });
      button.createEl("time", { text: moment(file.stat.mtime).format("MM-DD HH:mm") });
      button.addEventListener("click", () => void plugin.app.workspace.getLeaf(false).openFile(file));
    }
  }
};
var commandButtons = {
  id: "builtin/command-buttons",
  name: "\u547D\u4EE4\u6309\u94AE",
  icon: "command",
  description: "",
  params: [],
  async render(container, block, _host, plugin) {
    if (!plugin.commands.available()) {
      unavailable(container, t("\u547D\u4EE4\u63A5\u53E3\u4E0D\u53EF\u7528"));
      return;
    }
    const buttons = Array.isArray(block.params.buttons) ? block.params.buttons : [];
    if (!buttons.length) {
      container.createDiv({ text: t("\u5C1A\u65E0\u547D\u4EE4\u6309\u94AE\uFF0C\u8BF7\u5728\u7F16\u8F91\u6A21\u5F0F\u914D\u7F6E\u3002"), cls: "cw-empty" });
      return;
    }
    const wrapper = container.createDiv({ cls: "cw-actions" });
    for (const definition of buttons) {
      const command = paramString(definition.command);
      const known = plugin.commands.list().some((item) => item.id === command);
      const button = wrapper.createEl("button", { text: paramString(definition.label, command), cls: "mod-cta" });
      if (definition.icon) (0, import_obsidian3.setIcon)(button.createSpan({ cls: "cw-button-icon" }), paramString(definition.icon));
      button.disabled = !known;
      button.addEventListener("click", () => {
        var _a;
        if (definition.confirm && !((_a = container.ownerDocument.defaultView) == null ? void 0 : _a.confirm(paramString(definition.label, command)))) return;
        plugin.commands.execute(command);
      });
    }
  }
};
var health = {
  id: "builtin/note-health",
  name: "\u7B14\u8BB0\u5065\u5EB7\u5EA6",
  icon: "heart-pulse",
  description: "",
  params: [],
  async render(container, _block, _host, plugin) {
    const data = await plugin.index.metrics();
    const grid = container.createDiv({ cls: "cw-metrics" });
    metric(grid, t("\u5B64\u7ACB\u7B14\u8BB0"), data.orphanPaths.length, data.orphanPaths, plugin);
    metric(grid, t("\u7A7A\u7B14\u8BB0"), data.emptyPaths.length, data.emptyPaths, plugin);
    metric(grid, t("\u77ED\u7B14\u8BB0"), data.shortPaths.length, data.shortPaths, plugin);
  }
};
var graph = {
  id: "builtin/graph",
  name: "\u77E5\u8BC6\u56FE\u8C31",
  icon: "git-fork",
  description: "",
  params: [],
  async render(container, _block, _host, plugin) {
    if (!plugin.commands.available()) {
      unavailable(container, t("\u547D\u4EE4\u63A5\u53E3\u4E0D\u53EF\u7528"));
      return;
    }
    const button = container.createEl("button", { text: t("\u6253\u5F00"), cls: "mod-cta" });
    button.addEventListener("click", () => plugin.commands.execute("graph:open"));
  }
};
var templater = {
  id: "builtin/quick-create",
  name: "\u5FEB\u901F\u65B0\u5EFA",
  icon: "file-plus",
  description: "",
  params: [
    { key: "template", type: "note", defaultValue: "" },
    { key: "folder", type: "folder", defaultValue: "" },
    { key: "filename", type: "text", defaultValue: "{{date:YYYY-MM-DD}} {{title}}" },
    { key: "title", type: "text", defaultValue: "" }
  ],
  async render(container, block, _host, plugin) {
    const api = plugin.bridge.templater();
    if (!api) {
      unavailable(container, t("\u9700\u8981 Templater \u63D2\u4EF6"));
      return;
    }
    const button = container.createEl("button", { text: t("\u5FEB\u901F\u65B0\u5EFA"), cls: "mod-cta" });
    button.addEventListener("click", () => {
      const filename = renderFilenamePattern(paramString(block.params.filename, "{{date:YYYY-MM-DD}}"), paramString(block.params.title), (format) => moment().format(format));
      void api.create_new_note_from_template(paramString(block.params.template), paramString(block.params.folder), filename, true).catch((error) => new import_obsidian3.Notice(error instanceof Error ? error.message : String(error)));
    });
  }
};
var dataview = {
  id: "builtin/dataview",
  name: "Dataview \u67E5\u8BE2",
  icon: "table",
  description: "",
  params: [{ key: "code", type: "text", defaultValue: "" }],
  async render(container, block, host, plugin) {
    var _a, _b;
    const api = plugin.bridge.dataview();
    if (!api) {
      unavailable(container, t("\u9700\u8981 Dataview \u63D2\u4EF6"));
      return;
    }
    await api.executeJs(paramString(block.params.code), container, host, (_b = (_a = plugin.app.workspace.getActiveFile()) == null ? void 0 : _a.path) != null ? _b : "");
  }
};
var baseView = {
  id: "builtin/base",
  name: "Base \u89C6\u56FE",
  icon: "layout-list",
  description: "",
  params: [{ key: "file", type: "note", defaultValue: "" }],
  async render(container, block, host, plugin) {
    const path = paramString(block.params.file);
    if (!path) {
      unavailable(container, t("\u7EC4\u4EF6\u4E0D\u53EF\u7528"));
      return;
    }
    await import_obsidian3.MarkdownRenderer.render(plugin.app, `![[${path}]]`, container, "", host);
    const open = container.createEl("button", { text: t("\u6253\u5F00"), cls: "cw-link-button" });
    open.addEventListener("click", () => {
      const file = plugin.index.find(path);
      if (file) void plugin.app.workspace.getLeaf(false).openFile(file);
    });
  }
};
var wordsTrend = {
  id: "builtin/trends",
  name: "\u5B57\u6570\u4E0E\u8D8B\u52BF",
  icon: "chart-line",
  description: "",
  params: [],
  async render(container, _block, _host, plugin) {
    const history = plugin.config.showEstimatedHistory ? plugin.data.history : plugin.data.history.filter((point) => !point.estimated);
    if (!history.length) {
      container.createDiv({ text: t("\u6682\u65E0\u5185\u5BB9"), cls: "cw-empty" });
      return;
    }
    const max = Math.max(...history.map((point) => point.words), 1);
    const chart = container.createDiv({ cls: "cw-chart" });
    for (const point of history.slice(-90)) {
      const bar = chart.createDiv({ cls: `cw-chart__bar${point.estimated ? " is-estimated" : ""}` });
      bar.style.setProperty("--cw-bar-height", `${Math.max(2, point.words / max * 100)}%`);
      bar.ariaLabel = `${point.date}: ${point.words}`;
    }
  }
};
var todayTasks = {
  id: "builtin/today-tasks",
  name: "\u4ECA\u65E5\u4EFB\u52A1",
  icon: "list-checks",
  description: "",
  params: [],
  async render(container, _block, host, plugin) {
    await plugin.renderTasks(container, host);
  }
};
var BUILTINS = [vaultStats, todayTasks, quickJump, commandButtons, health, wordsTrend, graph, templater, baseView, dataview];
function builtinDefinitions() {
  return BUILTINS;
}
function builtinById(id) {
  return BUILTINS.find((definition) => definition.id === id);
}
function componentName(definition) {
  var _a;
  const names = {
    "builtin/vault-stats": t("\u4ED3\u5E93\u7EDF\u8BA1"),
    "builtin/today-tasks": t("\u4ECA\u65E5\u4EFB\u52A1"),
    "builtin/quick-jump": t("\u5FEB\u901F\u8DF3\u8F6C"),
    "builtin/command-buttons": t("\u547D\u4EE4\u6309\u94AE"),
    "builtin/note-health": t("\u7B14\u8BB0\u5065\u5EB7\u5EA6"),
    "builtin/trends": t("\u5B57\u6570\u4E0E\u8D8B\u52BF"),
    "builtin/graph": t("\u77E5\u8BC6\u56FE\u8C31"),
    "builtin/quick-create": t("\u5FEB\u901F\u65B0\u5EFA"),
    "builtin/base": t("Base \u89C6\u56FE"),
    "builtin/dataview": t("Dataview \u67E5\u8BE2")
  };
  return (_a = names[definition.id]) != null ? _a : definition.name;
}
function scriptDefinition(filename, name, icon, description, params) {
  return { id: `script/${filename}`, name, icon, description, params, async render(container, block, host, plugin) {
    if (!plugin.config.allowScripts) {
      unavailable(container, t("\u5DF2\u5728\u8BBE\u7F6E\u91CC\u5173\u95ED\u811A\u672C\u6267\u884C"));
      return;
    }
    const body = await plugin.readScript(filename);
    await runScript(body, {
      app: plugin.app,
      container,
      params: block.params,
      moment,
      component: host,
      size: { width: container.clientWidth, height: container.clientHeight }
    });
  } };
}
function addParamSetting(parent, definition, block, onChange) {
  var _a;
  const setting = new import_obsidian3.Setting(parent).setName(definition.key);
  const value = (_a = block.params[definition.key]) != null ? _a : definition.defaultValue;
  if (definition.type === "boolean") setting.addToggle((toggle) => toggle.setValue(Boolean(value)).onChange(async (next) => {
    block.params[definition.key] = next;
    await onChange();
  }));
  else if (definition.type === "number") setting.addText((text) => text.setValue(paramString(value, "0")).onChange(async (next) => {
    const parsed = Number(next);
    if (Number.isFinite(parsed)) {
      block.params[definition.key] = parsed;
      await onChange();
    }
  }));
  else if (definition.type.startsWith("select:")) setting.addDropdown((dropdown) => {
    for (const option of definition.type.slice(7).split(",")) dropdown.addOption(option, option);
    dropdown.setValue(paramString(value)).onChange(async (next) => {
      block.params[definition.key] = next;
      await onChange();
    });
  });
  else setting.addText((text) => text.setValue(paramString(value)).setPlaceholder(t("\u8BF7\u8F93\u5165\u503C")).onChange(async (next) => {
    block.params[definition.key] = next;
    await onChange();
  }));
}
function unavailable(container, message) {
  container.createDiv({ text: message, cls: "cw-unavailable" });
}

// src/workspace/layout.ts
var SPANS = [4, 6, 12];
function moveBlock(blocks, index, offset) {
  const target = index + offset;
  if (index < 0 || index >= blocks.length || target < 0 || target >= blocks.length) return [...blocks];
  const next = [...blocks];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}
function cycleSpan(span, direction) {
  const index = SPANS.indexOf(span);
  return SPANS[Math.max(0, Math.min(SPANS.length - 1, index + direction))];
}

// src/render/workspace-renderer.ts
var WorkspaceRenderer = class extends import_obsidian4.Component {
  constructor(plugin, container, editing) {
    super();
    this.plugin = plugin;
    this.container = container;
    this.editing = editing;
  }
  async render() {
    if (this.scope) {
      this.removeChild(this.scope);
      this.scope.unload();
    }
    this.scope = new import_obsidian4.Component();
    this.addChild(this.scope);
    this.container.empty();
    this.container.toggleClass("is-editing", this.editing());
    for (const [index, block] of this.plugin.data.workspace.blocks.entries()) this.renderBlock(block, index, this.scope);
    if (this.editing()) this.renderAdd(this.scope);
  }
  renderBlock(block, index, scope) {
    var _a, _b;
    const card = this.container.createDiv({ cls: `cw-block cw-span-${block.span}` });
    const definition = this.plugin.definition(block.componentId);
    const header = card.createDiv({ cls: "cw-block__header" });
    const title = header.createDiv({ cls: "cw-block__title" });
    if (definition) (0, import_obsidian4.setIcon)(title.createSpan({ cls: "cw-block__icon" }), definition.icon);
    title.createSpan({ text: block.title || (definition ? componentName(definition) : t("\u672A\u77E5\u7EC4\u4EF6")) });
    if (this.editing()) this.renderControls(header, card, block, index, (_a = definition == null ? void 0 : definition.params) != null ? _a : [], scope);
    const body = card.createDiv({ cls: "cw-block__body" });
    body.createDiv({ text: t("\u52A0\u8F7D\u4E2D\u2026"), cls: "cw-loading" });
    const render = async () => {
      body.empty();
      const child = new import_obsidian4.Component();
      scope.addChild(child);
      if (!definition) {
        body.createDiv({ text: t("\u672A\u77E5\u7EC4\u4EF6"), cls: "cw-unavailable" });
        return;
      }
      try {
        await definition.render(body, block, child, this.plugin);
      } catch (error) {
        body.empty();
        const detail = error instanceof Error ? `${error.message}${error.stack ? `
${error.stack.split("\n").slice(1, 3).join("\n")}` : ""}` : String(error);
        body.createEl("pre", { text: block.componentId.startsWith("script/") ? `${block.componentId.slice(7)}
${detail}` : detail, cls: "cw-error" });
        const retry = body.createEl("button", { text: t("\u91CD\u8BD5") });
        retry.addEventListener("click", () => void render());
      }
    };
    const ViewIntersectionObserver = (_b = card.ownerDocument.defaultView) == null ? void 0 : _b.IntersectionObserver;
    if (!ViewIntersectionObserver) {
      void render();
      return;
    }
    const observer = new ViewIntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        void render();
      }
    }, { rootMargin: "160px" });
    observer.observe(card);
    scope.register(() => observer.disconnect());
  }
  renderControls(header, card, block, index, params, scope) {
    const controls = header.createDiv({ cls: "cw-block__controls" });
    const button = (icon, label, action) => {
      const element = controls.createEl("button", { attr: { "aria-label": label, title: label } });
      (0, import_obsidian4.setIcon)(element, icon);
      element.addEventListener("click", action);
      return element;
    };
    button("arrow-up", t("\u4E0A\u79FB"), () => void this.move(index, -1));
    button("arrow-down", t("\u4E0B\u79FB"), () => void this.move(index, 1));
    const span = button("columns-3", block.span === 12 ? t("\u6574\u884C") : block.span === 6 ? t("\u534A\u884C") : t("\u4E09\u5206\u4E4B\u4E00"), () => void this.changeSpan(block, 1));
    span.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      void this.changeSpan(block, -1);
    });
    button("settings-2", t("\u914D\u7F6E"), () => this.toggleConfig(card, block, params, scope));
    button("trash-2", t("\u5220\u9664"), () => void this.remove(index));
    scope.registerDomEvent(card, "keydown", (event) => {
      if (!event.altKey) return;
      if (event.key === "ArrowUp") {
        event.preventDefault();
        void this.move(index, -1);
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        void this.move(index, 1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        void this.changeSpan(block, -1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        void this.changeSpan(block, 1);
      }
    });
    card.tabIndex = 0;
  }
  toggleConfig(card, block, params, scope) {
    const existing = card.querySelector(".cw-block__config");
    if (existing) {
      existing.remove();
      return;
    }
    const config = card.createDiv({ cls: "cw-block__config" });
    new import_obsidian4.Setting(config).setName(t("\u6807\u9898")).addText((text) => {
      var _a;
      return text.setValue((_a = block.title) != null ? _a : "").onChange(async (value) => {
        block.title = value || void 0;
        await this.plugin.persist();
      });
    });
    if (block.componentId === "builtin/command-buttons") {
      this.renderCommandEditor(config, block);
      return;
    }
    if (block.componentId === "builtin/dataview") {
      this.renderDataviewEditor(config, block, scope);
      return;
    }
    for (const param of params) addParamSetting(config, param, block, async () => this.persist());
  }
  renderCommandEditor(container, block) {
    const values = Array.isArray(block.params.buttons) ? block.params.buttons.filter((value) => typeof value === "object" && value !== null && !Array.isArray(value)) : [];
    const draw = () => {
      var _a;
      (_a = container.querySelector(".cw-command-editor")) == null ? void 0 : _a.remove();
      const editor = container.createDiv({ cls: "cw-command-editor" });
      values.forEach((value, index) => {
        const row = editor.createDiv({ cls: "cw-command-editor__row" });
        new import_obsidian4.Setting(row).setName(t("\u663E\u793A\u540D")).addText((text) => text.setValue(typeof value.label === "string" ? value.label : "").onChange(async (next) => {
          value.label = next;
          await this.plugin.persist();
        }));
        new import_obsidian4.Setting(row).setName(t("\u547D\u4EE4")).addDropdown((dropdown) => {
          dropdown.addOption("", t("\u8BF7\u9009\u62E9\u547D\u4EE4"));
          for (const command of this.plugin.commands.list()) dropdown.addOption(command.id, command.name);
          dropdown.setValue(typeof value.command === "string" ? value.command : "").onChange(async (next) => {
            value.command = next;
            await this.plugin.persist();
          });
        });
        new import_obsidian4.Setting(row).setName(t("\u8981\u786E\u8BA4")).addToggle((toggle) => toggle.setValue(value.confirm === true).onChange(async (next) => {
          value.confirm = next;
          await this.plugin.persist();
        }));
        new import_obsidian4.Setting(row).addButton((button) => button.setButtonText(t("\u5220\u9664")).onClick(async () => {
          values.splice(index, 1);
          block.params.buttons = values;
          await this.plugin.persist();
          draw();
        }));
      });
      new import_obsidian4.Setting(editor).addButton((button) => button.setButtonText(t("\u6DFB\u52A0\u6309\u94AE")).setCta().onClick(async () => {
        values.push({ label: "", command: "", confirm: false });
        block.params.buttons = values;
        await this.plugin.persist();
        draw();
      }));
    };
    draw();
  }
  renderDataviewEditor(container, block, scope) {
    let draft = typeof block.params.code === "string" ? block.params.code : "";
    const area = container.createEl("textarea", { cls: "cw-code-input", attr: { rows: "8", "aria-label": t("\u4EE3\u7801") } });
    area.value = draft;
    scope.registerDomEvent(area, "input", () => {
      draft = area.value;
    });
    const preview = container.createDiv({ cls: "cw-dataview-preview" });
    new import_obsidian4.Setting(container).addButton((button) => button.setButtonText(t("\u8BD5\u8FD0\u884C\u5E76\u4FDD\u5B58")).setCta().onClick(async () => {
      var _a, _b;
      preview.empty();
      const api = this.plugin.bridge.dataview();
      if (!api) {
        preview.setText(t("\u9700\u8981 Dataview \u63D2\u4EF6"));
        return;
      }
      const child = new import_obsidian4.Component();
      scope.addChild(child);
      try {
        await api.executeJs(draft, preview, child, (_b = (_a = this.plugin.app.workspace.getActiveFile()) == null ? void 0 : _a.path) != null ? _b : "");
        block.params.code = draft;
        await this.plugin.persist();
        preview.createDiv({ text: t("\u8BD5\u8FD0\u884C\u6210\u529F\uFF0C\u5DF2\u4FDD\u5B58\u3002"), cls: "cw-success" });
      } catch (error) {
        preview.createEl("pre", { text: error instanceof Error ? error.message : String(error), cls: "cw-error" });
      }
    }));
  }
  renderAdd(scope) {
    const section = this.container.createDiv({ cls: "cw-add" });
    section.createEl("h3", { text: t("\u6DFB\u52A0\u7EC4\u4EF6") });
    for (const definition of this.plugin.definitions()) {
      const button = section.createEl("button", { text: componentName(definition) });
      const icon = button.createSpan({ cls: "cw-button-icon" });
      (0, import_obsidian4.setIcon)(icon, definition.icon);
      scope.registerDomEvent(button, "click", () => void this.plugin.addBlock(definition));
    }
  }
  async move(index, offset) {
    this.plugin.data.workspace.blocks = moveBlock(this.plugin.data.workspace.blocks, index, offset);
    await this.persist();
  }
  async changeSpan(block, direction) {
    block.span = cycleSpan(block.span, direction);
    await this.persist();
  }
  async remove(index) {
    this.plugin.data.workspace.blocks.splice(index, 1);
    await this.persist();
  }
  async persist() {
    await this.plugin.persist();
    await this.render();
  }
};

// src/views/workspace-view.ts
var WORKSPACE_VIEW_TYPE = "cw-workspace";
var CustomWorkspaceView = class extends import_obsidian5.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.editing = false;
  }
  getViewType() {
    return WORKSPACE_VIEW_TYPE;
  }
  getDisplayText() {
    return t("\u81EA\u5B9A\u4E49\u5DE5\u4F5C\u53F0");
  }
  getIcon() {
    return "layout-dashboard";
  }
  async onOpen() {
    this.contentEl.addClass("cw-root", `cw-density-${this.plugin.config.density}`);
    this.addAction("pencil", t("\u7F16\u8F91\u6A21\u5F0F"), () => {
      this.editing = !this.editing;
      void this.refresh();
    });
    this.renderer = new WorkspaceRenderer(this.plugin, this.contentEl, () => this.editing);
    this.addChild(this.renderer);
    await this.renderer.render();
  }
  async onClose() {
    this.renderer = void 0;
    this.contentEl.empty();
  }
  async refresh() {
    var _a;
    await ((_a = this.renderer) == null ? void 0 : _a.render());
  }
  toggleEditing() {
    this.editing = !this.editing;
    void this.refresh();
  }
};

// src/types.ts
var DEFAULT_SETTINGS = {
  language: "auto",
  density: "comfortable",
  autoOpen: true,
  autoOpenMode: "new-tab",
  journalFolder: "",
  dateFormat: "YYYY-MM-DD",
  excludedFolders: [],
  shortNoteThreshold: 10,
  recentDays: 7,
  showEstimatedHistory: true,
  allowScripts: false
};
var DEFAULT_DATA = {
  version: 1,
  settings: DEFAULT_SETTINGS,
  workspace: { blocks: [
    { id: "default-stats", componentId: "builtin/vault-stats", span: 12, params: {} },
    { id: "default-tasks", componentId: "builtin/today-tasks", span: 12, params: {} },
    { id: "default-jump", componentId: "builtin/quick-jump", span: 12, params: { limit: 8 } },
    { id: "default-commands", componentId: "builtin/command-buttons", span: 12, params: { buttons: [] } }
  ] },
  history: [],
  historyInitialized: false
};
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function mergeSettings(value) {
  if (!isRecord(value)) return { ...DEFAULT_SETTINGS };
  const result = { ...DEFAULT_SETTINGS };
  if (["auto", "zh", "en"].includes(String(value.language))) result.language = value.language;
  if (["comfortable", "compact"].includes(String(value.density))) result.density = value.density;
  if (typeof value.autoOpen === "boolean") result.autoOpen = value.autoOpen;
  if (["new-tab", "replace"].includes(String(value.autoOpenMode))) result.autoOpenMode = value.autoOpenMode;
  if (typeof value.journalFolder === "string") result.journalFolder = value.journalFolder;
  if (typeof value.dateFormat === "string" && value.dateFormat) result.dateFormat = value.dateFormat;
  if (Array.isArray(value.excludedFolders)) result.excludedFolders = value.excludedFolders.filter((x) => typeof x === "string");
  if (typeof value.shortNoteThreshold === "number" && value.shortNoteThreshold >= 0) result.shortNoteThreshold = value.shortNoteThreshold;
  if (typeof value.recentDays === "number" && value.recentDays > 0) result.recentDays = value.recentDays;
  if (typeof value.showEstimatedHistory === "boolean") result.showEstimatedHistory = value.showEstimatedHistory;
  if (typeof value.allowScripts === "boolean") result.allowScripts = value.allowScripts;
  return result;
}
function migrateData(value) {
  if (!isRecord(value)) return structuredClone(DEFAULT_DATA);
  const workspace = isRecord(value.workspace) && Array.isArray(value.workspace.blocks) ? { blocks: value.workspace.blocks.filter(isBlock) } : structuredClone(DEFAULT_DATA.workspace);
  const history = Array.isArray(value.history) ? value.history.filter(isSnapshot) : [];
  return {
    version: 1,
    settings: mergeSettings(value.settings),
    workspace,
    history,
    historyInitialized: typeof value.historyInitialized === "boolean" ? value.historyInitialized : history.length > 0
  };
}
function isBlock(value) {
  return isRecord(value) && typeof value.id === "string" && typeof value.componentId === "string" && [4, 6, 12].includes(Number(value.span)) && isRecord(value.params);
}
function isSnapshot(value) {
  return isRecord(value) && typeof value.date === "string" && typeof value.notes === "number" && typeof value.links === "number" && typeof value.words === "number";
}

// src/services/command-service.ts
var CommandService = class {
  constructor(app) {
    this.app = app;
  }
  registry() {
    return this.app.commands;
  }
  available() {
    var _a;
    return typeof ((_a = this.registry()) == null ? void 0 : _a.executeCommandById) === "function";
  }
  list() {
    var _a, _b;
    return Object.values((_b = (_a = this.registry()) == null ? void 0 : _a.commands) != null ? _b : {}).sort((a, b) => a.name.localeCompare(b.name));
  }
  execute(id) {
    var _a, _b;
    (_b = (_a = this.registry()) == null ? void 0 : _a.executeCommandById) == null ? void 0 : _b.call(_a, id);
  }
};

// src/services/plugin-bridge.ts
var PluginBridge = class {
  constructor(app) {
    this.app = app;
  }
  plugins() {
    var _a, _b;
    return (_b = (_a = this.app.plugins) == null ? void 0 : _a.plugins) != null ? _b : {};
  }
  dataview() {
    var _a;
    const plugin = this.plugins().dataview;
    return typeof ((_a = plugin == null ? void 0 : plugin.api) == null ? void 0 : _a.executeJs) === "function" ? plugin.api : void 0;
  }
  templater() {
    var _a;
    const plugin = this.plugins()["templater-obsidian"];
    return typeof ((_a = plugin == null ? void 0 : plugin.templater) == null ? void 0 : _a.create_new_note_from_template) === "function" ? plugin.templater : void 0;
  }
};

// src/services/vault-index.ts
var import_obsidian6 = require("obsidian");

// src/metrics/text.ts
function stripMarkdown(input) {
  return input.replace(/^---\s*$[\s\S]*?^---\s*$/m, "").replace(/```[\s\S]*?```/g, "").replace(/^(?: {4}|\t).*$/gm, "").replace(/<!--[^]*?-->/g, "").replace(/`[^`]*`/g, "").replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/!\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, "$1").replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, "$2 $1").replace(/^\s*[^\p{L}\p{N}]+\s*$/gmu, "").replace(/^[>#*+\-\d.)\s]+/gm, "").trim();
}
function countReadableWords(input) {
  var _a, _b, _c, _d;
  const text = stripMarkdown(input);
  const cjk = (_b = (_a = text.match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu)) == null ? void 0 : _a.length) != null ? _b : 0;
  const nonCjk = text.replace(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu, " ");
  const words = (_d = (_c = nonCjk.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu)) == null ? void 0 : _c.length) != null ? _d : 0;
  return cjk + words;
}

// src/metrics/aggregate.ts
function aggregateMetrics(notes, attachments, folders, now, recentDays, shortThreshold) {
  const recentCutoff = now - recentDays * 864e5;
  return {
    notes: notes.length,
    attachments,
    folders,
    recent: notes.filter((note) => note.ctime >= recentCutoff).length,
    words: notes.reduce((sum, note) => sum + note.words, 0),
    links: notes.reduce((sum, note) => sum + note.outgoing, 0),
    orphanPaths: notes.filter((note) => note.outgoing === 0 && note.incoming === 0).map((note) => note.path),
    emptyPaths: notes.filter((note) => note.words === 0).map((note) => note.path),
    shortPaths: notes.filter((note) => note.words <= shortThreshold).map((note) => note.path)
  };
}

// src/services/vault-index.ts
var VaultIndex = class {
  constructor(app, excluded, recentDays, threshold) {
    this.app = app;
    this.excluded = excluded;
    this.recentDays = recentDays;
    this.threshold = threshold;
  }
  invalidate() {
    this.metricsPromise = void 0;
  }
  included(path) {
    return !this.excluded().some((folder) => path === folder || path.startsWith(`${folder}/`));
  }
  async metrics() {
    var _a;
    (_a = this.metricsPromise) != null ? _a : this.metricsPromise = this.compute();
    return this.metricsPromise;
  }
  async compute() {
    var _a;
    const markdown = this.app.vault.getMarkdownFiles().filter((file) => this.included(file.path));
    const incoming = /* @__PURE__ */ new Map();
    const resolved = this.app.metadataCache.resolvedLinks;
    for (const targets of Object.values(resolved)) for (const [path, count] of Object.entries(targets)) incoming.set(path, ((_a = incoming.get(path)) != null ? _a : 0) + count);
    const notes = await Promise.all(markdown.map(async (file) => {
      var _a2, _b;
      return {
        path: file.path,
        ctime: file.stat.ctime,
        words: countReadableWords(await this.app.vault.cachedRead(file)),
        outgoing: Object.values((_a2 = resolved[file.path]) != null ? _a2 : {}).reduce((sum, count) => sum + count, 0),
        incoming: (_b = incoming.get(file.path)) != null ? _b : 0
      };
    }));
    const files = this.app.vault.getFiles().filter((file) => this.included(file.path));
    const folders = new Set(files.map((file) => {
      var _a2;
      return (_a2 = file.parent) == null ? void 0 : _a2.path;
    }).filter((path) => Boolean(path))).size;
    return aggregateMetrics(notes, files.length - markdown.length, folders, Date.now(), this.recentDays(), this.threshold());
  }
  recentNotes(limit, folder = "") {
    return this.app.vault.getMarkdownFiles().filter((file) => this.included(file.path) && (!folder || file.path.startsWith(`${folder}/`))).sort((a, b) => b.stat.mtime - a.stat.mtime).slice(0, limit);
  }
  find(path) {
    const file = this.app.vault.getAbstractFileByPath(path);
    return file instanceof import_obsidian6.TFile ? file : null;
  }
};

// src/tasks/parser.ts
var DATE_MARKERS = {
  "\u{1F4C5}": "due",
  "\u23F3": "scheduled",
  "\u{1F6EB}": "start",
  "\u2705": "done",
  "\u2795": "created"
};
function parseTaskLine(line) {
  var _a, _b;
  const match = line.match(/^\s*-\s+\[([ xX])\]\s+(.+)$/);
  if (!match) return null;
  const text = match[2];
  const task = { text, completed: match[1].toLowerCase() === "x", tags: [], fields: {} };
  for (const [marker, field] of Object.entries(DATE_MARKERS)) {
    const date = (_a = text.match(new RegExp(`${marker}\\s*(\\d{4}-\\d{2}-\\d{2})`))) == null ? void 0 : _a[1];
    if (date && isIsoDate(date)) task[field] = date;
  }
  task.priority = (_b = text.match(/[🔺⏫🔼🔽⏬]/u)) == null ? void 0 : _b[0];
  task.tags = [...text.matchAll(/(?:^|\s)#([\p{L}\p{N}_/-]+)/gu)].map((item) => item[1]);
  for (const item of text.matchAll(/([\p{L}\p{N}_-]+)::\s*([^\s].*?)(?=\s+[\p{L}\p{N}_-]+::|$)/gu)) task.fields[item[1]] = item[2].trim();
  return task;
}
function isIsoDate(value) {
  const date = /* @__PURE__ */ new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
function assignedDate(task, fileDate) {
  var _a, _b, _c;
  return (_c = (_b = (_a = task.due) != null ? _a : task.scheduled) != null ? _b : task.start) != null ? _c : fileDate;
}
function classifyTask(task, fileDate, today, recentCutoff) {
  if (task.completed) return task.done && task.done >= recentCutoff && task.done <= today ? "completed" : null;
  const date = assignedDate(task, fileDate);
  if (date === today) return "today";
  if (date && date < today) return "overdue";
  return null;
}

// src/history/history.ts
function upsertSnapshot(history, snapshot) {
  return [...history.filter((item) => item.date !== snapshot.date), snapshot].sort((a, b) => a.date.localeCompare(b.date));
}
function estimateHistory(notes) {
  const dates = [...new Set(notes.map((note) => note.created))].sort();
  return dates.map((date) => {
    const present = notes.filter((note) => note.created <= date);
    return { date, notes: present.length, words: present.reduce((sum, note) => sum + note.words, 0), links: present.reduce((sum, note) => sum + note.links, 0), estimated: true };
  });
}

// src/main.ts
var CustomWorkspacePlugin = class extends import_obsidian7.Plugin {
  constructor() {
    super(...arguments);
    this.data = structuredClone(DEFAULT_DATA);
    this.config = this.data.settings;
    this.commands = new CommandService(this.app);
    this.bridge = new PluginBridge(this.app);
    this.index = new VaultIndex(this.app, () => this.config.excludedFolders, () => this.config.recentDays, () => this.config.shortNoteThreshold);
    this.scripts = /* @__PURE__ */ new Map();
    this.alive = false;
    this.saveChain = Promise.resolve();
  }
  async onload() {
    this.alive = true;
    this.data = migrateData(await this.loadData());
    this.config = this.data.settings;
    setLanguage(this.config.language);
    await this.ensureScriptDirectory();
    await this.reloadScripts();
    this.registerView(WORKSPACE_VIEW_TYPE, (leaf) => new CustomWorkspaceView(leaf, this));
    this.addRibbonIcon("layout-dashboard", t("\u6253\u5F00\u5DE5\u4F5C\u53F0"), () => void this.openWorkspace(false));
    this.addCommand({ id: "open-workspace", name: t("\u6253\u5F00\u5DE5\u4F5C\u53F0"), callback: () => void this.openWorkspace(false) });
    this.addCommand({ id: "toggle-edit-mode", name: t("\u5207\u6362\u7F16\u8F91\u6A21\u5F0F"), checkCallback: (checking) => {
      var _a;
      const view = (_a = this.app.workspace.getLeavesOfType(WORKSPACE_VIEW_TYPE)[0]) == null ? void 0 : _a.view;
      if (!(view instanceof CustomWorkspaceView)) return false;
      if (!checking) view.toggleEditing();
      return true;
    } });
    this.addSettingTab(new CustomWorkspaceSettingTab(this.app, this));
    const viewWindow = this.app.workspace.containerEl.ownerDocument.defaultView;
    let refreshTimer;
    const invalidate = () => {
      this.index.invalidate();
      if (refreshTimer !== void 0) viewWindow == null ? void 0 : viewWindow.clearTimeout(refreshTimer);
      refreshTimer = viewWindow == null ? void 0 : viewWindow.setTimeout(() => {
        refreshTimer = void 0;
        if (this.alive) this.refreshViews();
      }, 250);
    };
    this.register(() => {
      if (refreshTimer !== void 0) viewWindow == null ? void 0 : viewWindow.clearTimeout(refreshTimer);
    });
    this.registerEvent(this.app.vault.on("create", invalidate));
    this.registerEvent(this.app.vault.on("delete", invalidate));
    this.registerEvent(this.app.vault.on("rename", invalidate));
    this.registerEvent(this.app.vault.on("modify", invalidate));
    this.registerEvent(this.app.metadataCache.on("changed", invalidate));
    this.app.workspace.onLayoutReady(() => {
      if (this.alive && this.config.autoOpen && !this.app.workspace.getLeavesOfType(WORKSPACE_VIEW_TYPE).length) void this.openWorkspace(true);
    });
  }
  onunload() {
    this.alive = false;
  }
  async persist() {
    this.data.settings = this.config;
    this.saveChain = this.saveChain.then(() => this.saveData(this.data));
    await this.saveChain;
  }
  definition(id) {
    var _a;
    return (_a = builtinById(id)) != null ? _a : this.scripts.get(id);
  }
  definitions() {
    return [...builtinDefinitions(), ...this.config.allowScripts ? this.scripts.values() : []];
  }
  async addBlock(definition) {
    const params = Object.fromEntries(definition.params.map((param) => [param.key, param.defaultValue]));
    const block = { id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`, componentId: definition.id, span: 12, params };
    this.data.workspace.blocks.push(block);
    await this.persist();
    this.refreshViews();
  }
  refreshViews() {
    for (const leaf of this.app.workspace.getLeavesOfType(WORKSPACE_VIEW_TYPE)) if (leaf.view instanceof CustomWorkspaceView) void leaf.view.refresh();
  }
  async openWorkspace(automatic) {
    const existing = this.app.workspace.getLeavesOfType(WORKSPACE_VIEW_TYPE)[0];
    if (existing) {
      if (!automatic) await this.app.workspace.revealLeaf(existing);
      return;
    }
    const leaf = this.config.autoOpenMode === "replace" ? this.app.workspace.getLeaf(false) : this.app.workspace.getLeaf("tab");
    await leaf.setViewState({ type: WORKSPACE_VIEW_TYPE, active: true });
    if (!automatic || this.config.autoOpenMode === "new-tab") await this.app.workspace.revealLeaf(leaf);
  }
  scriptDirectory() {
    var _a;
    return (0, import_obsidian7.normalizePath)(`${(_a = this.manifest.dir) != null ? _a : `${this.app.vault.configDir}/plugins/${this.manifest.id}`}/data`);
  }
  async ensureScriptDirectory() {
    const adapter = this.app.vault.adapter;
    const directory = this.scriptDirectory();
    if (!await adapter.exists(directory)) await adapter.mkdir(directory);
    const readme = (0, import_obsidian7.normalizePath)(`${directory}/README.md`);
    if (!await adapter.exists(readme)) await adapter.write(readme, "# Custom Workspace scripts\n\nPlace trusted `.js` files here. Scripts can read and write your vault and are not sandboxed.\n");
  }
  async reloadScripts() {
    this.scripts.clear();
    const listing = await this.app.vault.adapter.list(this.scriptDirectory());
    for (const path of listing.files.filter((file) => file.endsWith(".js"))) {
      const filename = path.split("/").pop();
      if (!filename) continue;
      try {
        const source = await this.app.vault.adapter.read(path);
        const meta = parseScriptMetadata(source, filename);
        this.scripts.set(`script/${filename}`, scriptDefinition(filename, meta.name, meta.icon, meta.description, meta.params));
      } catch (e) {
      }
    }
  }
  async readScript(filename) {
    return this.app.vault.adapter.read((0, import_obsidian7.normalizePath)(`${this.scriptDirectory()}/${filename}`));
  }
  async createScript() {
    const adapter = this.app.vault.adapter;
    let index = 1;
    let filename = "my-component.js";
    while (await adapter.exists((0, import_obsidian7.normalizePath)(`${this.scriptDirectory()}/${filename}`))) {
      index += 1;
      filename = `my-component-${index}.js`;
    }
    const source = `// cw:name=My component
// cw:icon=file-code
// cw:desc=A trusted local component
// cw:param=title:text|Hello

const { container, params } = ctx;
container.createEl("p", { text: String(params.title) });
`;
    await adapter.write((0, import_obsidian7.normalizePath)(`${this.scriptDirectory()}/${filename}`), source);
    await this.reloadScripts();
    new import_obsidian7.Notice(`${t("\u5DF2\u65B0\u5EFA\u811A\u672C")}: ${filename}`);
  }
  async renderTasks(container, host) {
    if (!this.config.journalFolder) {
      container.createDiv({ text: t("\u6682\u65E0\u5185\u5BB9"), cls: "cw-empty" });
      return;
    }
    const today = moment().format("YYYY-MM-DD");
    const cutoff = moment().subtract(this.config.recentDays - 1, "days").format("YYYY-MM-DD");
    const tasks = [];
    const files = this.app.vault.getMarkdownFiles().filter((file) => file.path.startsWith(`${this.config.journalFolder}/`));
    for (const file of files) {
      const parsedDate = moment(file.basename, this.config.dateFormat, true);
      const fileDate = parsedDate.isValid() ? parsedDate.format("YYYY-MM-DD") : void 0;
      const lines = (await this.app.vault.cachedRead(file)).split(/\r?\n/);
      lines.forEach((line, index) => {
        const task = parseTaskLine(line);
        if (!task) return;
        const group = classifyTask(task, fileDate, today, cutoff);
        if (group) tasks.push({ file, line: index, text: task.text, group });
      });
    }
    for (const group of ["today", "overdue", "completed"]) {
      const section = container.createDiv({ cls: "cw-task-group" });
      section.createEl("h4", { text: group === "today" ? t("\u4ECA\u5929") : group === "overdue" ? t("\u9057\u7559") : t("\u6700\u8FD1\u5B8C\u6210") });
      const matching = tasks.filter((task) => task.group === group);
      if (!matching.length) section.createDiv({ text: t("\u6682\u65E0\u5185\u5BB9"), cls: "cw-empty" });
      for (const task of matching) {
        const button = section.createEl("button", { text: task.text, cls: "cw-task" });
        host.registerDomEvent(button, "click", () => void this.openTask(task));
      }
    }
  }
  async openTask(task) {
    const leaf = this.app.workspace.getLeaf(false);
    await leaf.openFile(task.file);
    const view = leaf.view;
    if (view instanceof import_obsidian7.MarkdownView) {
      view.editor.setCursor({ line: task.line, ch: 0 });
      view.editor.scrollIntoView({ from: { line: task.line, ch: 0 }, to: { line: task.line, ch: task.text.length } }, true);
    }
  }
  async recordHistory(metrics) {
    const today = moment().format("YYYY-MM-DD");
    if (!this.data.historyInitialized) {
      const notes = await Promise.all(this.app.vault.getMarkdownFiles().filter((file) => !this.config.excludedFolders.some((folder) => file.path.startsWith(`${folder}/`))).map(async (file) => {
        var _a;
        return {
          created: moment(file.stat.ctime).format("YYYY-MM-DD"),
          words: countReadableWords(await this.app.vault.cachedRead(file)),
          links: Object.values((_a = this.app.metadataCache.resolvedLinks[file.path]) != null ? _a : {}).reduce((sum, value) => sum + value, 0)
        };
      }));
      this.data.history = estimateHistory(notes).filter((point) => point.date < today);
      this.data.historyInitialized = true;
    }
    const current = this.data.history.find((point) => point.date === today);
    if (current && !current.estimated && current.notes === metrics.notes && current.links === metrics.links && current.words === metrics.words) return;
    this.data.history = upsertSnapshot(this.data.history, { date: today, notes: metrics.notes, links: metrics.links, words: metrics.words });
    await this.persist();
  }
};
