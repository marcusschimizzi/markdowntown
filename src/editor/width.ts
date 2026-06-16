import type { Width } from '../state/store';

export function maxWidthFor(width: Width): number {
  return ({ narrow: 560, normal: 660, wide: 760 } as const)[width];
}
