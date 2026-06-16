import { describe, it, expect } from 'vitest';
import { markdownFiles } from './mdFiles';

const files = [
  { name: 'a.md', path: '/x/a.md', isDir: false },
  { name: 'b.txt', path: '/x/b.txt', isDir: false },
  { name: 'sub', path: '/x/sub', isDir: true },
  { name: 'C.markdown', path: '/x/C.markdown', isDir: false },
];

describe('markdownFiles', () => {
  it('keeps only .md/.markdown files, excludes dirs', () => {
    const res = markdownFiles(files);
    expect(res.map((f) => f.name)).toEqual(['a.md', 'C.markdown']);
  });
});
