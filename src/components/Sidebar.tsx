import { markdownFiles, baseName } from '../lib/mdFiles';
import type { FileEntry } from '../lib/types';
import './Sidebar.css';

interface Props {
  files: FileEntry[];
  activePath: string | null;
  onOpen: (path: string) => void;
  onOpenFolder: () => void;
  onNew: () => void;
  onToggleTheme: () => void;
  isDark: boolean;
}

export function Sidebar({ files, activePath, onOpen, onOpenFolder, onNew, onToggleTheme, isDark }: Props) {
  const mdFiles = markdownFiles(files);
  return (
    <div className="sidebar">
      <div className="sidebar__section">DOCUMENTS</div>
      <div className="sidebar__list">
        {mdFiles.length === 0 && (
          <button className="sidebar__empty" onClick={onOpenFolder}>Open folder…</button>
        )}
        {mdFiles.map((f) => (
          <div
            key={f.path}
            className={`sidebar__row${f.path === activePath ? ' is-active' : ''}`}
            onClick={() => onOpen(f.path)}
          >
            <FileIcon />
            <span className="sidebar__name">{baseName(f.path)}</span>
          </div>
        ))}
      </div>
      <div className="sidebar__footer">
        <button className="sidebar__action" onClick={onNew}>+ New</button>
        <button className="sidebar__action" onClick={onToggleTheme}>{isDark ? '☼' : '☾'}</button>
      </div>
    </div>
  );
}

function FileIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.7" strokeLinejoin="round">
      <path d="M6 3h8l5 5v13H6z" /><path d="M14 3v5h5" />
    </svg>
  );
}
