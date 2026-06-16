import type { TreeNode } from '../lib/types';
import { flattenMarkdownFiles } from '../lib/tree';
import { baseName } from '../lib/mdFiles';
import { FileTree } from './FileTree';
import './Sidebar.css';

interface Props {
  tree: TreeNode | null;
  folder: string | null;
  activePath: string | null;
  onOpen: (path: string) => void;
  onOpenFolder: () => void;
  onOpenFile: () => void;
  onCloseFolder: () => void;
  onNew: () => void;
  onToggleTheme: () => void;
  isDark: boolean;
}

export function Sidebar({
  tree,
  folder,
  activePath,
  onOpen,
  onOpenFolder,
  onOpenFile,
  onCloseFolder,
  onNew,
  onToggleTheme,
  isDark,
}: Props) {
  const isEmpty = flattenMarkdownFiles(tree).length === 0;
  return (
    <div className="sidebar">
      {folder ? (
        <div className="sidebar__header">
          <span className="sidebar__folder" title={folder}>{baseName(folder)}</span>
          <div className="sidebar__header-actions">
            <button className="sidebar__icon" aria-label="Open folder" title="Open folder" onClick={onOpenFolder}>
              <FolderIcon />
            </button>
            <button className="sidebar__icon" aria-label="Open file" title="Open file" onClick={onOpenFile}>
              <FileOpenIcon />
            </button>
            <button className="sidebar__icon" aria-label="Close folder" title="Close folder" onClick={onCloseFolder}>
              <CloseIcon />
            </button>
          </div>
        </div>
      ) : (
        <div className="sidebar__section">DOCUMENTS</div>
      )}
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

function FolderIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.7" strokeLinejoin="round">
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  );
}

function FileOpenIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.7" strokeLinejoin="round">
      <path d="M6 3h8l5 5v13H6z" />
      <path d="M14 3v5h5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
