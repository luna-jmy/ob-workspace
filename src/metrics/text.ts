export function stripMarkdown(input: string): string {
  return input
    .replace(/^---\s*$[\s\S]*?^---\s*$/m, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/^(?: {4}|\t).*$/gm, "")
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
