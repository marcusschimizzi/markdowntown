import { describe, it, expect } from 'vitest';
import { fuzzyFilter } from './fuzzy';

const items = [
  { id: '1', label: 'On Writing Plainly' },
  { id: '2', label: 'Reading notes' },
  { id: '3', label: 'Ideas & fragments' },
];

describe('fuzzyFilter', () => {
  it('returns all items for an empty query', () => {
    expect(fuzzyFilter(items, '', (i) => i.label)).toHaveLength(3);
  });

  it('matches subsequences case-insensitively', () => {
    const res = fuzzyFilter(items, 'wrt', (i) => i.label);
    expect(res[0].label).toBe('On Writing Plainly');
  });

  it('drops non-matches', () => {
    const res = fuzzyFilter(items, 'zzz', (i) => i.label);
    expect(res).toHaveLength(0);
  });

  it('ranks contiguous matches above scattered ones', () => {
    const res = fuzzyFilter(items, 'read', (i) => i.label);
    expect(res[0].label).toBe('Reading notes');
  });
});
