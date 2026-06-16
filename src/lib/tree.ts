import type { FileEntry, TreeNode } from './types';

/**
 * Flattens a directory tree into a flat list of its Markdown file entries
 * (every non-dir node). Used by the ⌘K palette, which searches a flat list.
 */
export function flattenMarkdownFiles(tree: TreeNode | null): FileEntry[] {
  if (!tree) return [];
  const out: FileEntry[] = [];
  const walk = (node: TreeNode): void => {
    if (node.isDir) {
      for (const child of node.children) walk(child);
    } else {
      out.push({ name: node.name, path: node.path, isDir: false });
    }
  };
  walk(tree);
  return out;
}
