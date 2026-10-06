import { describe, expect, it } from "vitest";
import { countReadableWords, stripFrontmatter } from "../src/metrics/text";

const body = [
  "# 会议记录",
  "",
  "## 讨论内容",
  "",
  "今天讨论了项目进度与下一步计划，团队同步了各自的进展，并明确了后续的分工安排。",
  "会议持续了两个小时，讨论非常充分，各方都给出了明确的承诺时间点。",
  "",
  "| 议题 | 结论 |",
  "| ---- | ---- |",
  "| 进度 | 按期 |",
  "",
  "- [ ] 跟进事项一",
  "- [ ] 跟进事项二",
].join("\n");

describe("frontmatter stripping", () => {
  it("well-formed frontmatter is stripped", () => {
    expect(stripFrontmatter(`---\nstatus: archived\n---\n\n${body}`)).toBe(`\n${body}`);
  });

  it("BOM-prefixed frontmatter still pairs with its own closer, not a body --- separator", () => {
    // 1.0.2 的正则会拿 frontmatter 的结束 --- 去和正文分隔线配对，吞掉两线之间的正文
    const words = countReadableWords(`FEFF---\nstatus: archived\n---\n\n${body}\n\n---\n\n尾部备注内容`);
    expect(words).toBeGreaterThan(50);
  });

  it("a malformed ---- closer does not swallow the body up to a separator", () => {
    expect(countReadableWords(`---\nstatus: archived\n----\n\n${body}\n\n---\n\n尾部备注内容`)).toBeGreaterThan(50);
  });

  it("a YAML ... closer is recognized", () => {
    expect(countReadableWords(`---\nstatus: archived\n...\n\n${body}\n\n---\n\n尾部备注内容`)).toBeGreaterThan(50);
  });

  it("notes without frontmatter keep content between two --- separators", () => {
    expect(countReadableWords(`${body}\n\n---\n\n分隔后的内容段落\n\n---\n\n再一段内容`)).toBeGreaterThan(50);
  });

  it("an unterminated frontmatter block is left intact rather than over-stripped", () => {
    expect(stripFrontmatter(`---\nstatus: archived\n\n${body}`)).toContain("status: archived");
  });

  it("CRLF frontmatter is stripped", () => {
    expect(stripFrontmatter("---\r\nstatus: archived\r\n---\r\n\r\n正文")).toBe("\n正文");
  });

  it("fenced code blocks are still excluded from the count", () => {
    expect(countReadableWords(`---\nstatus: archived\n---\n\n\`\`\`\n${body}\n\`\`\`\n`)).toBe(0);
  });

  it("plain long note counts well above the short threshold", () => {
    expect(countReadableWords(`---\nstatus: archived\n---\n\n${body}`)).toBeGreaterThan(50);
  });

  it("an all-list note with tab/4-space nested items keeps its content", () => {
    // 1.0.2 把缩进行当缩进代码删掉，嵌套列表（Obsidian 默认 Tab 缩进）整段消失，
    // 全列表笔记只剩顶层标签的字数，长会议记录全数掉进「短笔记」
    const note = [
      "---", "status: archived", "---", "",
      "- 时间：14:00",
      "\t- 参会：张三、李四、王五",
      "\t- 议题一：项目进度讨论，各方同步了最新进展与风险",
      "    - 议题二：下阶段计划与分工安排，确认了交付时间点",
      "    - 议题三：预算调整方案，财务侧给出新的核算口径",
      "- 备注",
      "\t- 下次评审时间另行通知",
    ].join("\n");
    expect(countReadableWords(note)).toBeGreaterThan(40);
  });
});
