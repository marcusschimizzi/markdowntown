import { describe, it, expect } from 'vitest';
import { shouldReload } from './watch';

describe('shouldReload', () => {
  it('reloads when the active file changed and the doc is clean', () => {
    expect(shouldReload({ activePath: '/x/a.md', dirty: false }, ['/x/a.md'])).toBe(true);
  });
  it('does NOT reload when the doc is dirty (conflict)', () => {
    expect(shouldReload({ activePath: '/x/a.md', dirty: true }, ['/x/a.md'])).toBe(false);
  });
  it('does NOT reload when the change is for another file', () => {
    expect(shouldReload({ activePath: '/x/a.md', dirty: false }, ['/x/b.md'])).toBe(false);
  });
});
