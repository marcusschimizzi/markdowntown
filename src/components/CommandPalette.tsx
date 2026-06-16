import { useMemo, useState } from 'react';
import { fuzzyFilter } from '../lib/fuzzy';
import { baseName } from '../lib/mdFiles';
import type { FileEntry } from '../lib/types';
import './CommandPalette.css';

export interface Command { id: string; label: string; hint?: string; run: () => void; }
interface Props {
  files: FileEntry[];
  commands: Command[];
  onOpenFile: (path: string) => void;
  onClose: () => void;
}

export function CommandPalette({ files, commands, onOpenFile, onClose }: Props) {
  const [query, setQuery] = useState('');
  const fileResults = useMemo(
    () => fuzzyFilter(files, query, (f) => baseName(f.path)), [files, query]);
  const cmdResults = useMemo(
    () => fuzzyFilter(commands, query, (c) => c.label), [commands, query]);

  const runFirst = () => {
    if (fileResults.length) { onOpenFile(fileResults[0].path); onClose(); return; }
    if (cmdResults.length) { const c = cmdResults[0]; onClose(); c.run(); }
  };

  return (
    <div className="palette__scrim" onClick={onClose}>
      <div className="palette" onClick={(e) => e.stopPropagation()}>
        <div className="palette__head">
          <input
            autoFocus
            className="palette__input"
            placeholder="Go to a file or run a command…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); runFirst(); }
              else if (e.key === 'Escape') onClose();
            }}
          />
          <span className="palette__esc">esc</span>
        </div>
        <div className="palette__results">
          {fileResults.length > 0 && <div className="palette__group">FILES</div>}
          {fileResults.map((f) => (
            <div key={f.path} className="palette__row"
              onClick={() => { onOpenFile(f.path); onClose(); }}>
              <span>{baseName(f.path)}</span><span className="palette__hint">↵</span>
            </div>
          ))}
          {cmdResults.length > 0 && <div className="palette__group">COMMANDS</div>}
          {cmdResults.map((c) => (
            <div key={c.id} className="palette__row"
              onClick={() => { onClose(); c.run(); }}>
              <span>{c.label}</span>{c.hint && <span className="palette__hint">{c.hint}</span>}
            </div>
          ))}
          {fileResults.length === 0 && cmdResults.length === 0 && (
            <div className="palette__empty">No matches</div>
          )}
        </div>
      </div>
    </div>
  );
}
