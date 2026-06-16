import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// ProseMirror/TipTap needs range + layout geometry jsdom doesn't implement.
Range.prototype.getBoundingClientRect = () => ({
  bottom: 0, height: 0, left: 0, right: 0, top: 0, width: 0, x: 0, y: 0,
  toJSON() { return {}; },
});
Range.prototype.getClientRects = () => ({
  item: () => null,
  length: 0,
  [Symbol.iterator]: vi.fn(),
}) as unknown as DOMRectList;
// jsdom doesn't implement elementFromPoint; ProseMirror/TipTap calls it.
Document.prototype.elementFromPoint = vi.fn(() => null);

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false, media: query, onchange: null,
    addEventListener: vi.fn(), removeEventListener: vi.fn(),
    addListener: vi.fn(), removeListener: vi.fn(), dispatchEvent: vi.fn(),
  }),
});
