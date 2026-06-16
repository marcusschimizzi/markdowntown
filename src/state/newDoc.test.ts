import { describe, it, expect } from 'vitest';
import { nextUntitledName } from './newDoc';

describe('nextUntitledName', () => {
  it('uses Untitled.md when free', () => {
    expect(nextUntitledName([])).toBe('Untitled.md');
  });
  it('dedupes to Untitled 2.md', () => {
    expect(nextUntitledName(['Untitled.md'])).toBe('Untitled 2.md');
  });
  it('finds the next free index', () => {
    expect(nextUntitledName(['Untitled.md', 'Untitled 2.md'])).toBe('Untitled 3.md');
  });
});
