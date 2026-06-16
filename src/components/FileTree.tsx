import { useState } from 'react';
import type { TreeNode } from '../lib/types';
import { baseName } from '../lib/mdFiles';
import './FileTree.css';

interface Props {
  root: TreeNode | null;
  activePath: string | null;
  onOpen: (path: string) => void;
}

/**
 * Renders the CONTENTS of the workspace root as a nested tree (the root node is
 * the folder itself, so we render `root.children`, not a row for the folder).
 * Directories expand/collapse locally; a directory that (recursively) contains
 * the active path starts expanded so opening a nested file reveals it.
 */
export function FileTree({ root, activePath, onOpen }: Props) {
  if (!root) return null;
  return (
    <>
      {root.children.map((node) => (
        <TreeRow key={node.path} node={node} depth={0} activePath={activePath} onOpen={onOpen} />
      ))}
    </>
  );
}

/** True if `node` is, or recursively contains, the given path. */
export function containsPath(node: TreeNode, activePath: string | null): boolean {
  if (!activePath) return false;
  if (node.path === activePath) return true;
  return node.children.some((child) => containsPath(child, activePath));
}

interface RowProps {
  node: TreeNode;
  depth: number;
  activePath: string | null;
  onOpen: (path: string) => void;
}

function TreeRow({ node, depth, activePath, onOpen }: RowProps) {
  // Auto-expand on first render when this directory holds the active file.
  const [expanded, setExpanded] = useState(() => containsPath(node, activePath));
  const padLeft = 8 + depth * 14;

  if (node.isDir) {
    return (
      <>
        <div
          className="sidebar__row filetree__dir"
          style={{ paddingLeft: padLeft }}
          onClick={() => setExpanded((v) => !v)}
        >
          <Chevron open={expanded} />
          <span className="sidebar__name">{node.name}</span>
        </div>
        {expanded &&
          node.children.map((child) => (
            <TreeRow
              key={child.path}
              node={child}
              depth={depth + 1}
              activePath={activePath}
              onOpen={onOpen}
            />
          ))}
      </>
    );
  }

  return (
    <div
      className={`sidebar__row${node.path === activePath ? ' is-active' : ''}`}
      style={{ paddingLeft: padLeft }}
      onClick={() => onOpen(node.path)}
    >
      <FileIcon />
      <span className="sidebar__name">{baseName(node.path)}</span>
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`filetree__chevron${open ? ' is-open' : ''}`}
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    >
      <path d="M6 3h8l5 5v13H6z" />
      <path d="M14 3v5h5" />
    </svg>
  );
}
