/** 随机书摘纯函数层（AGENTS.md §5.1 quotes/）：书摘行的过滤与清洗，零 DOM、不依赖宿主 */

/** 【】书名 → 《书名》（与 random-quote3.js 同款格式）；入参用 basename（不带扩展名） */
export function formatBookName(fileName: string): string {
  return `《${fileName.replace(/^【.*?】/, "").trim()}》`;
}

/** 解析标签参数：中英文逗号分隔多标签，逐个去首部 # 与空白，空项丢弃 */
export function parseTagList(raw: string): string[] {
  return raw.split(/[,，]/).map((piece) => piece.trim().replace(/^#/, "").trim()).filter((piece) => piece !== "");
}

/** 取正文中包含任一标签的行（书摘行以标签标记）；空标签集不匹配任何行 */
export function matchingQuoteLines(text: string, tags: readonly string[]): string[] {
  const list = tags.filter((tag) => tag !== "");
  if (!list.length) return [];
  return text.split(/\r?\n/).filter((line) => list.some((tag) => line.includes(tag)));
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
