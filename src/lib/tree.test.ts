import { describe, it, expect } from 'vitest';
import { flattenMarkdownFiles } from './tree';
import type { TreeNode } from './types';

describe('flattenMarkdownFiles', () => {
  it('flattens nested files to a flat FileEntry list with correct paths', () => {
    const tree: TreeNode = {
      name: 'root',
      path: '/root',
      isDir: true,
      children: [
        { name: 'a.md', path: '/root/a.md', isDir: false, children: [] },
        {
          name: 'sub',
          path: '/root/sub',
          isDir: true,
          children: [
            { name: 'b.md', path: '/root/sub/b.md', isDir: false, children: [] },
            {
              name: 'deep',
              path: '/root/sub/deep',
              isDir: true,
              children: [
                { name: 'c.md', path: '/root/sub/deep/c.md', isDir: false, children: [] },
              ],
            },
          ],
        },
      ],
    };

    const files = flattenMarkdownFiles(tree);
    const paths = files.map((f) => f.path).sort();
    expect(paths).toEqual(['/root/a.md', '/root/sub/b.md', '/root/sub/deep/c.md']);
    expect(files.every((f) => f.isDir === false)).toBe(true);
    expect(files.find((f) => f.path === '/root/a.md')).toEqual({
      name: 'a.md',
      path: '/root/a.md',
      isDir: false,
    });
  });

  it('returns [] for null', () => {
    expect(flattenMarkdownFiles(null)).toEqual([]);
  });

  it('returns [] for an empty dir tree', () => {
    const tree: TreeNode = { name: 'root', path: '/root', isDir: true, children: [] };
    expect(flattenMarkdownFiles(tree)).toEqual([]);
  });
});
