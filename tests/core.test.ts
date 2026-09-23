import { describe, expect, it } from "vitest";
import { countReadableWords, stripMarkdown } from "../src/metrics/text";
import { aggregateMetrics } from "../src/metrics/aggregate";
import { assignedDate, classifyTask, parseTaskLine } from "../src/tasks/parser";
import { parseScriptMetadata, renderFilenamePattern, withParamDefaults } from "../src/params/parser";
import { cycleSpan, moveBlock } from "../src/workspace/layout";
import { estimateHistory, upsertSnapshot } from "../src/history/history";
import { DEFAULT_DATA, mergeSettings, migrateData, type Block } from "../src/types";

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
      { path: "a.md", words: 0, ctime: 100, outgoing: 0, incoming: 0 },
      { path: "b.md", words: 20, ctime: 200, outgoing: 2, incoming: 1 }
    ], 3, 2, 200, 1, 10);
    expect(result).toMatchObject({ notes: 2, attachments: 3, folders: 2, words: 20, links: 2 });
    expect(result.orphanPaths).toEqual(["a.md"]); expect(result.shortPaths).toEqual(["a.md"]);
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

describe("layout", () => {
  const blocks: Block[] = [
    { id: "a", componentId: "x", span: 4, params: {} }, { id: "b", componentId: "x", span: 6, params: {} }
  ];
  it("moves within bounds", () => { expect(moveBlock(blocks, 0, 1).map((item) => item.id)).toEqual(["b", "a"]); expect(moveBlock(blocks, 0, -1)).toEqual(blocks); });
  it("cycles width within bounds", () => { expect(cycleSpan(4, 1)).toBe(6); expect(cycleSpan(12, 1)).toBe(12); });
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
});
