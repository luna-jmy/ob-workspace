import type { Block, BlockSpan } from "../types";

export const SPANS: BlockSpan[] = [3, 4, 6, 12];
export function moveBlock(blocks: Block[], index: number, offset: -1 | 1): Block[] {
  const target = index + offset;
  if (index < 0 || index >= blocks.length || target < 0 || target >= blocks.length) return [...blocks];
  const next = [...blocks];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}
export function cycleSpan(span: BlockSpan, direction: -1 | 1): BlockSpan {
  const index = SPANS.indexOf(span);
  return SPANS[Math.max(0, Math.min(SPANS.length - 1, index + direction))];
}
