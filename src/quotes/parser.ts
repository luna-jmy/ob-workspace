/** 随机书摘纯函数层（AGENTS.md §5.1 quotes/）：书摘行的过滤与清洗，零 DOM、不依赖宿主 */

/** 【】书名 → 《书名》（与 random-quote3.js 同款格式） */
export function formatBookName(fileName: string): string {
  return `《${fileName.replace(/^【.*?】/, "").trim()}》`;
}

/** 取正文中包含标签的行（书摘行以标签标记）；空标签不匹配任何行 */
export function matchingQuoteLines(text: string, tag: string): string[] {
  if (!tag) return [];
  return text.split(/\r?\n/).filter((line) => line.includes(tag));
}

/** 清洗书摘行：去标签、内联字段、行首标记，压缩空白；清洗后为空则回退原文 */
export function cleanQuoteText(raw: string): string {
  const cleaned = raw.replace(/#[^\s#]+/g, "").replace(/\[.*?::.*?\]/g, "").replace(/^[#\-*\s>]+/, "").replace(/\s{2,}/g, " ").trim();
  return cleaned || raw.trim();
}

/** 均匀随机取一个元素（空数组返回 undefined） */
export function randomOf<T>(items: readonly T[]): T | undefined {
  return items.length ? items[Math.floor(Math.random() * items.length)] : undefined;
}
