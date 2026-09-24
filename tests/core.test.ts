import { describe, expect, it } from "vitest";
import { countReadableWords, stripMarkdown } from "../src/metrics/text";
import { aggregateMetrics } from "../src/metrics/aggregate";
import { assignedDate, classifyTask, parseTaskLine } from "../src/tasks/parser";
import { parseScriptMetadata, renderFilenamePattern, withParamDefaults } from "../src/params/parser";
import { cycleSpan, moveBlock, moveBlockTo, moveItem } from "../src/workspace/layout";
import { dailyWordChanges, estimateHistory, upsertSnapshot } from "../src/history/history";
import { DEFAULT_DATA, mergeSettings, migrateData, type Block } from "../src/types";
import { activityLevel, aggregateHeatmap, aggregateTopFolders, areaPath, linePathRange, resolveCreatedDate } from "../src/metrics/analytics";
import { svgClasses } from "../src/ui/classes";
import { filterNotePaths, matchesNoteFilter } from "../src/metrics/note-filter";
import { templatePathCandidates } from "../src/params/template-path";

describe("markdown text metrics", () => {
  it("removes metadata, code, comments and URL targets", () => {
    const input = `---\ntitle: Hidden\n---\n中文 two words\n\`inline\`\n\`\`\`ts\nhidden()\n\`\`\`\n[visible](https://example.com) <!-- secret -->`;
    expect(stripMarkdown(input)).not.toContain("Hidden");
    expect(countReadableWords(input)).toBe(5);
  });
  it("handles empty and mixed CJK text", () => { expect(countReadableWords("" )).toBe(0); expect(countReadableWords("知识 graph 42")).toBe(4); });
});

describe("metric aggregation", () => {
  it("computes counts and health lists", () => {
    const result = aggregateMetrics([
      { path: "a.md", words: 0, ctime: 100, mtime: 100, outgoing: 0, incoming: 0 },
      { path: "b.md", words: 20, ctime: 200, mtime: 200, outgoing: 2, incoming: 1 }
    ], ["a.png", "b.pdf", "c.canvas"], ["one", "two"], 200, 1, 10);
    expect(result).toMatchObject({ notes: 2, attachments: 3, folders: 2, words: 20, links: 2 });
    expect(result.orphanPaths).toEqual(["a.md"]); expect(result.shortPaths).toEqual(["a.md"]);
  });
});

describe("analytics", () => {
  it("prefers frontmatter creation dates and groups words by system modification time", () => {
    const now = new Date(2026, 8, 23, 12).getTime(); const yesterday = new Date(2026, 8, 22, 8).getTime();
    expect(aggregateHeatmap([
      { path: "a.md", words: 10, ctime: now, mtime: now, frontmatterCreated: "2026-09-22 09:30" },
      { path: "b.md", words: 5, ctime: yesterday, mtime: now }
    ], now)).toEqual([{ date: "2026-09-22", notes: 2, words: 0 }, { date: "2026-09-23", notes: 0, words: 15 }]);
    expect(activityLevel(2, 4)).toBe(3); expect(activityLevel(0, 4)).toBe(0);
  });
  it("parses supported created values and rejects impossible dates", () => {
    const fallback = new Date(2026, 8, 23, 12).getTime();
    expect(resolveCreatedDate("2021/6/28 17:05", fallback)).toBe("2021-06-28");
    expect(resolveCreatedDate("2025-03-02", fallback)).toBe("2025-03-02");
    expect(resolveCreatedDate("2026-99-99", fallback)).toBe("2026-09-23");
    expect(resolveCreatedDate(null, fallback)).toBe("2026-09-23");
  });
  it("summarizes top-level folders and root notes", () => {
    const result = aggregateTopFolders([{ path: "Areas/a.md", words: 10, ctime: 1, mtime: 1 }, { path: "Areas/b.md", words: 20, ctime: 1, mtime: 1 }, { path: "root.md", words: 5, ctime: 1, mtime: 1 }]);
    expect(result[0]).toMatchObject({ name: "Areas", notes: 2, words: 30 }); expect(result[1]).toMatchObject({ name: "", notes: 1, words: 5 });
  });
  it("builds bounded line and area paths", () => {
    expect(linePathRange([0, 5, 10], 10, 1, 2)).toBe("M 50.00 24.00 L 100.00 0.00");
    expect(areaPath([0, 10], 10)).toContain("L 100 48 L 0 48 Z");
  });
});

describe("quick-jump filters", () => {
  const note = { path: "300 Resources/example.md", tags: ["#reading", "#topic/ai"], frontmatter: { status: "active", owner: ["Luna", "Team"], nested: { stage: 2 } } };
  it("matches folder and tags with or without a hash", () => {
    expect(matchesNoteFilter(note, { folder: "300 Resources", tag: "reading" })).toBe(true);
    expect(matchesNoteFilter(note, { tag: "#missing" })).toBe(false);
  });
  it("matches scalar, array, and dotted frontmatter values", () => {
    expect(matchesNoteFilter(note, { frontmatterKey: "status", frontmatterValue: "ACTIVE" })).toBe(true);
    expect(matchesNoteFilter(note, { frontmatterKey: "owner", frontmatterValue: "Luna" })).toBe(true);
    expect(matchesNoteFilter(note, { frontmatterKey: "nested.stage", frontmatterValue: "2" })).toBe(true);
  });
  it("searches drill-down paths case-insensitively", () => {
    expect(filterNotePaths(["Areas/Alpha.md", "Books/Beta.md"], " alpha ")).toEqual(["Areas/Alpha.md"]);
    expect(filterNotePaths(["Areas/Alpha.md"], "")).toEqual(["Areas/Alpha.md"]);
  });
});

describe("DOM class tokens", () => {
  it("passes SVG classes as separate DOMTokenList entries", () => {
    expect(svgClasses("cw-link-chart__line", "is-estimated")).toEqual(["cw-link-chart__line", "is-estimated"]);
    expect(svgClasses("cw-link-chart__line", "is-estimated").every((token) => !token.includes(" "))).toBe(true);
  });
});

describe("task parsing", () => {
  it("parses all supported markers", () => {
    const task = parseTaskLine("- [ ] Do it 🔺 📅 2026-09-23 🛫 2026-09-20 ⏳ 2026-09-21 ✅ 2026-09-24 ➕ 2026-09-01 #work owner:: Luna");
    expect(task).toMatchObject({ completed: false, priority: "🔺", due: "2026-09-23", start: "2026-09-20", scheduled: "2026-09-21", done: "2026-09-24", created: "2026-09-01", tags: ["work"] });
    expect(task?.fields.owner).toBe("Luna");
  });
  it("rejects non-tasks and invalid dates", () => { expect(parseTaskLine("plain")).toBeNull(); expect(parseTaskLine("- [ ] bad 📅 2026-99-99")?.due).toBeUndefined(); });
  it("uses date priority and classifies read-only sections", () => {
    const task = parseTaskLine("- [ ] item 📅 2026-09-22 ⏳ 2026-09-23")!;
    expect(assignedDate(task, "2026-09-21")).toBe("2026-09-22"); expect(classifyTask(task, undefined, "2026-09-23", "2026-09-17")).toBe("overdue");
    expect(classifyTask(parseTaskLine("- [x] done ✅ 2026-09-22")!, undefined, "2026-09-23", "2026-09-17")).toBe("completed");
  });
});

describe("script parameters", () => {
  it("parses metadata and ignores malformed types", () => {
    const meta = parseScriptMetadata("// cw:name=Reading\n// cw:icon=book\n// cw:param=limit:number|5\n// cw:param=mode:select:a,b|b\n// cw:param=nope:wat|x", "test.js");
    expect(meta.name).toBe("Reading"); expect(meta.params).toHaveLength(2); expect(meta.params[0].defaultValue).toBe(5);
  });
  it("falls back to filename and defaults", () => {
    const meta = parseScriptMetadata("// body", "hello.js"); expect(meta.name).toBe("hello");
    expect(withParamDefaults([{ key: "x", type: "number", defaultValue: 3 }], {})).toEqual({ x: 3 });
  });
  it("renders safe filename patterns", () => { expect(renderFilenamePattern("{{date:YYYY}} {{title}}", "a/b", () => "2026")).toBe("2026 a-b"); });
});

describe("Templater paths", () => {
  it("accepts template paths with or without .md and checks the configured template folder", () => {
    expect(templatePathCandidates("900 Assets/910 Templates/TPL-NewNote", "900 Assets/910 Templates")).toEqual([
      "900 Assets/910 Templates/TPL-NewNote.md"
    ]);
    expect(templatePathCandidates("TPL-NewNote.md", "900 Assets/910 Templates")).toEqual([
      "TPL-NewNote.md", "900 Assets/910 Templates/TPL-NewNote.md"
    ]);
  });
});

describe("layout", () => {
  const blocks: Block[] = [
    { id: "a", componentId: "x", span: 4, params: {} }, { id: "b", componentId: "x", span: 6, params: {} }
  ];
  it("moves within bounds", () => { expect(moveBlock(blocks, 0, 1).map((item) => item.id)).toEqual(["b", "a"]); expect(moveBlock(blocks, 0, -1)).toEqual(blocks); });
  it("moves directly for drag and drop", () => {
    const three = [...blocks, { id: "c", componentId: "x", span: 12, params: {} } satisfies Block];
    expect(moveBlockTo(three, 0, 2).map((item) => item.id)).toEqual(["b", "c", "a"]);
    expect(moveBlockTo(three, 2, 0).map((item) => item.id)).toEqual(["c", "a", "b"]);
    expect(moveBlockTo(blocks, -1, 1)).toEqual(blocks);
  });
  it("cycles all four width options within bounds", () => { expect(cycleSpan(3, 1)).toBe(4); expect(cycleSpan(4, 1)).toBe(6); expect(cycleSpan(12, 1)).toBe(12); });
  it("reorders button definitions without mutating the source", () => {
    const values = [{ label: "a" }, { label: "b" }];
    expect(moveItem(values, 1, -1)).toEqual([{ label: "b" }, { label: "a" }]);
    expect(values).toEqual([{ label: "a" }, { label: "b" }]);
  });
});

describe("history", () => {
  it("upserts once per date", () => {
    const next = upsertSnapshot([{ date: "2026-09-23", notes: 1, links: 1, words: 1 }], { date: "2026-09-23", notes: 2, links: 2, words: 2 });
    expect(next).toEqual([{ date: "2026-09-23", notes: 2, links: 2, words: 2 }]);
  });
  it("marks cumulative estimates", () => {
    const points = estimateHistory([{ created: "2026-01-01", words: 2, links: 1 }, { created: "2026-01-02", words: 3, links: 2 }]);
    expect(points[1]).toEqual({ date: "2026-01-02", notes: 2, words: 5, links: 3, estimated: true });
  });
  it("builds 30 calendar-day net changes around zero", () => {
    const points = dailyWordChanges([
      { date: "2026-09-20", notes: 1, links: 1, words: 100 },
      { date: "2026-09-21", notes: 1, links: 1, words: 130 },
      { date: "2026-09-22", notes: 1, links: 1, words: 90 },
      { date: "2026-09-23", notes: 1, links: 1, words: 95 }
    ], "2026-09-23", 3);
    expect(points.map((point) => point.words)).toEqual([30, -40, 5]);
    expect(points.every((point) => !point.estimated)).toBe(true);
  });
  it("marks changes across estimates or missing daily snapshots as estimated", () => {
    const points = dailyWordChanges([
      { date: "2026-09-20", notes: 1, links: 1, words: 100, estimated: true },
      { date: "2026-09-22", notes: 1, links: 1, words: 150 }
    ], "2026-09-22", 2);
    expect(points).toMatchObject([{ words: 0, estimated: true }, { words: 50, estimated: true }]);
  });
});

describe("settings migration", () => {
  it("preserves valid values and repairs bad ones", () => {
    expect(mergeSettings({ autoOpen: false, recentDays: -1, excludedFolders: ["ok", 2] })).toMatchObject({ autoOpen: false, recentDays: 7, excludedFolders: ["ok"] });
  });
  it("uses defaults for corrupt data and discards only bad blocks", () => {
    expect(migrateData(null)).toEqual(DEFAULT_DATA);
    const migrated = migrateData({ settings: {}, workspace: { blocks: [{ id: "ok", componentId: "x", span: 12, params: {} }, { bad: true }] }, history: [] });
    expect(migrated.workspace.blocks).toHaveLength(1);
  });
  it("migrates the removed health component into selected vault stats", () => {
    const migrated = migrateData({ workspace: { blocks: [{ id: "health", componentId: "builtin/note-health", span: 6, params: {} }] } });
    expect(migrated.version).toBe(5); expect(migrated.workspace.blocks[0]).toMatchObject({ componentId: "builtin/vault-stats", params: { items: ["orphans", "empty", "short"] } });
  });
  it("removes obsolete graph blocks without disturbing other components", () => {
    const migrated = migrateData({ workspace: { blocks: [{ id: "graph", componentId: "builtin/graph", span: 12, params: {} }, { id: "keep", componentId: "builtin/trends", span: 6, params: {} }] } });
    expect(migrated.workspace.blocks.map((block) => block.id)).toEqual(["keep"]);
  });
  it("rebuilds old estimates while preserving real snapshots", () => {
    const migrated = migrateData({ version: 3, historyInitialized: true, workspace: { blocks: [] }, history: [
      { date: "2026-09-22", notes: 10, links: 20, words: 30, estimated: true },
      { date: "2026-09-23", notes: 11, links: 22, words: 33 }
    ] });
    expect(migrated).toMatchObject({ version: 5, historyInitialized: false, history: [{ date: "2026-09-23", notes: 11, links: 22, words: 33 }] });
  });
  it("migrates one legacy quick-create configuration into a button list", () => {
    const migrated = migrateData({ version: 4, workspace: { blocks: [{ id: "create", componentId: "builtin/quick-create", span: 12, params: {
      template: "Templates/blank.md", folder: "Inbox", filename: "{{date:YYYY-MM-DD}} {{title}}", title: "空白笔记"
    } }] } });
    expect(migrated.version).toBe(5);
    expect(migrated.workspace.blocks[0].params).toEqual({ buttons: [{
      label: "快速新建", template: "Templates/blank.md", folder: "Inbox", filename: "{{date:YYYY-MM-DD}} {{title}}", title: "空白笔记"
    }] });
  });
});
