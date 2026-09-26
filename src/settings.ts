import { App, PluginSettingTab, Setting } from "obsidian";
import type CustomWorkspacePlugin from "./main";
import { setLanguage, t } from "./i18n";

export class CustomWorkspaceSettingTab extends PluginSettingTab {
  constructor(app: App, private readonly plugin: CustomWorkspacePlugin) { super(app, plugin); }
  display(): void {
    this.containerEl.empty();
    new Setting(this.containerEl).setName(t("界面语言")).addDropdown((dropdown) => dropdown
      .addOption("auto", t("跟随 Obsidian")).addOption("zh", t("中文")).addOption("en", t("英文"))
      .setValue(this.plugin.config.language).onChange(async (value) => { this.plugin.config.language = value as "auto" | "zh" | "en"; setLanguage(this.plugin.config.language); await this.plugin.persist(); this.display(); }));
    new Setting(this.containerEl).setName(t("排版密度")).addDropdown((dropdown) => dropdown.addOption("comfortable", t("宽松")).addOption("compact", t("紧凑"))
      .setValue(this.plugin.config.density).onChange(async (value) => { this.plugin.config.density = value as "comfortable" | "compact"; await this.plugin.persist(); this.plugin.refreshViews(); }));
    new Setting(this.containerEl).setName(t("启动时自动打开")).addToggle((toggle) => toggle.setValue(this.plugin.config.autoOpen).onChange(async (value) => { this.plugin.config.autoOpen = value; await this.plugin.persist(); }));
    new Setting(this.containerEl).setName(t("自动打开方式")).addDropdown((dropdown) => dropdown.addOption("new-tab", t("新标签页")).addOption("replace", t("替换当前标签页"))
      .setValue(this.plugin.config.autoOpenMode).onChange(async (value) => { this.plugin.config.autoOpenMode = value as "new-tab" | "replace"; await this.plugin.persist(); }));
    textSetting(this.containerEl, t("日志目录"), this.plugin.config.journalFolder, async (value) => { this.plugin.config.journalFolder = value; await this.plugin.persist(); });
    textSetting(this.containerEl, t("日期格式"), this.plugin.config.dateFormat, async (value) => { this.plugin.config.dateFormat = value || "YYYY-MM-DD"; await this.plugin.persist(); });
    textSetting(this.containerEl, t("排除目录"), this.plugin.config.excludedFolders.join(", "), async (value) => {
      this.plugin.config.excludedFolders = value.split(",").map((item) => item.trim()).filter(Boolean);
      // 排除范围变了，历史快照与估算口径全部失效——整条作废，下次渲染按新口径重建
      // （否则「昨天=旧口径、今天=新口径」，字数曲线会出现几十万级的假跳变）
      this.plugin.data.history = []; this.plugin.data.historyInitialized = false;
      this.plugin.index.invalidate(); await this.plugin.persist(); this.plugin.refreshViews();
    });
    numberSetting(this.containerEl, t("空/短笔记阈值"), this.plugin.config.shortNoteThreshold, async (value) => { this.plugin.config.shortNoteThreshold = value; this.plugin.index.invalidate(); await this.plugin.persist(); });
    numberSetting(this.containerEl, t("最近天数"), this.plugin.config.recentDays, async (value) => { this.plugin.config.recentDays = value; this.plugin.index.invalidate(); await this.plugin.persist(); });
    new Setting(this.containerEl).setName(t("显示估算历史")).addToggle((toggle) => toggle.setValue(this.plugin.config.showEstimatedHistory).onChange(async (value) => { this.plugin.config.showEstimatedHistory = value; await this.plugin.persist(); this.plugin.refreshViews(); }));
    new Setting(this.containerEl).setName(t("允许执行自定义脚本")).setDesc(t("脚本可以读写你的 vault，只运行你信任的代码。")).addToggle((toggle) => toggle.setValue(this.plugin.config.allowScripts).onChange(async (value) => { this.plugin.config.allowScripts = value; await this.plugin.persist(); await this.plugin.reloadScripts(); this.plugin.refreshViews(); }));
    new Setting(this.containerEl).setName(t("脚本目录")).setDesc(this.plugin.scriptDirectory()).addButton((button) => button.setButtonText(t("新建脚本")).onClick(() => this.plugin.createScript()));
    new Setting(this.containerEl).setName(t("清空历史")).setDesc(t("工作台数据只存在插件目录；换机器或卸载前请自行备份。")).addButton((button) => button.setButtonText(t("清空")).onClick(async () => { this.plugin.data.history = []; this.plugin.data.historyInitialized = true; await this.plugin.persist(); }));
  }
}

function textSetting(container: HTMLElement, name: string, value: string, change: (value: string) => Promise<void>): void {
  new Setting(container).setName(name).addText((text) => text.setValue(value).onChange(change));
}
function numberSetting(container: HTMLElement, name: string, value: number, change: (value: number) => Promise<void>): void {
  new Setting(container).setName(name).addText((text) => text.setValue(String(value)).onChange(async (next) => { const parsed = Number(next); if (Number.isFinite(parsed) && parsed >= 0) await change(parsed); }));
}
