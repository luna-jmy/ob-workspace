import type { Block, BlockSpan } from "../types";

export const SPANS: BlockSpan[] = [3, 4, 6, 12];
export function moveItem<T>(items: T[], index: number, offset: -1 | 1): T[] {
  const target = index + offset;
  if (index < 0 || index >= items.length || target < 0 || target >= items.length) return [...items];
  const next = [...items];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}
export function moveBlock(blocks: Block[], index: number, offset: -1 | 1): Block[] {
  return moveItem(blocks, index, offset);
}
export function moveBlockTo(blocks: Block[], from: number, to: number): Block[] {
  if (from < 0 || from >= blocks.length || to < 0 || to >= blocks.length || from === to) return [...blocks];
  const next = [...blocks]; const [block] = next.splice(from, 1); next.splice(to, 0, block); return next;
}
export function cycleSpan(span: BlockSpan, direction: -1 | 1): BlockSpan {
  const index = SPANS.indexOf(span);
  return SPANS[Math.max(0, Math.min(SPANS.length - 1, index + direction))];
}
