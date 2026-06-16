import type { TreeNode } from '../lib/types';
import { flattenMarkdownFiles } from '../lib/tree';
import { FileTree } from './FileTree';
import './Sidebar.css';

interface Props {
  tree: TreeNode | null;
  activePath: string | null;
  onOpen: (path: string) => void;
  onOpenFolder: () => void;
  onNew: () => void;
  onToggleTheme: () => void;
  isDark: boolean;
}

export function Sidebar({ tree, activePath, onOpen, onOpenFolder, onNew, onToggleTheme, isDark }: Props) {
  const isEmpty = flattenMarkdownFiles(tree).length === 0;
  return (
    <div className="sidebar">
      <div className="sidebar__section">DOCUMENTS</div>
      <div className="sidebar__list">
        {isEmpty ? (
          <button className="sidebar__empty" onClick={onOpenFolder}>Open folder…</button>
        ) : (
          <FileTree root={tree} activePath={activePath} onOpen={onOpen} />
        )}
      </div>
      <div className="sidebar__footer">
        <button className="sidebar__action" onClick={onNew}>+ New</button>
        <button className="sidebar__action" onClick={onToggleTheme}>{isDark ? '☼' : '☾'}</button>
      </div>
    </div>
  );
}
