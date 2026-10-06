/**
 * 去掉 frontmatter，返回正文。
 *
 * 只在首行就是 `---`（允许 BOM 前缀）时才动手，结束符认 `---` / `...`
 * （含 `----` 这类多横线手误）；配不上就原样返回——正文里的 `---` 分隔线
 * 绝不能当结束符用，否则开头的 `---` 会跨过整个正文去跟分隔线配对，把
 * 两线之间的内容整段吞掉：带 BOM 或结束符手误的长笔记就这样被数成几个字，
 * 全部掉进「短笔记」（vault-dashboard 1.0.3 修复的根因）。
 */
export function stripFrontmatter(input: string): string {
  const lines = input.replace(/^FEFF/, "").split(/\r?\n/);
  if (lines[0]?.trimEnd() !== "---") return input;
  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (/^-{3,}$/.test(line) || /^\.{3,}$/.test(line)) return lines.slice(i + 1).join("\n");
  }
  return input;
}

export function stripMarkdown(input: string): string {
  return stripFrontmatter(input)
    .replace(/\r\n?/g, "\n")
    .replace(/^```[\s\S]*?^```[ \t]*$/gm, "")
    // 不删 4 空格 / Tab 缩进行：嵌套列表就是这副缩进，全列表的笔记会被整段
    // 当成缩进代码删掉、只剩顶层标签的字数（vault-dashboard 1.0.3 修复）。
    // 无围栏缩进代码因此计入字数——多算无害，误删正文才是事故。
    .replace(/<!--[^]*?-->/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/!\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, "$1")
    .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, "$2 $1")
    .replace(/^\s*[^\p{L}\p{N}]+\s*$/gmu, "")
    .replace(/^[>#*+\-\d.)\s]+/gm, "")
    .trim();
}

export function countReadableWords(input: string): number {
  const text = stripMarkdown(input);
  const cjk = text.match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu)?.length ?? 0;
  const nonCjk = text.replace(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu, " ");
  const words = nonCjk.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
  return cjk + words;
}
