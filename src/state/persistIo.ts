import { appConfigDir, join } from '@tauri-apps/api/path';
import { readDirTree, readFile, writeFile, createDir } from '../lib/fsBridge';
import { startWatching } from '../lib/watch';
import { applySettingsToDom } from '../settings/applySettings';
import { useAppStore } from './store';
import { type Persisted, DEFAULT_PERSISTED, toPersisted, fromPersisted } from './persist';

const STATE_FILE = 'state.json';

async function statePath(): Promise<string> {
  const dir = await appConfigDir();
  return join(dir, STATE_FILE);
}

/** Load persisted state from `<appConfigDir>/state.json`; defaults on any error. */
export async function loadPersisted(): Promise<Persisted> {
  try {
    const path = await statePath();
    const raw = await readFile(path);
    return fromPersisted(JSON.parse(raw));
  } catch {
    return DEFAULT_PERSISTED;
  }
}

/** Persist state to `<appConfigDir>/state.json`. Errors are swallowed/logged. */
export async function savePersisted(p: Persisted): Promise<void> {
  try {
    const dir = await appConfigDir();
    await createDir(dir);
    const path = await join(dir, STATE_FILE);
    await writeFile(path, JSON.stringify(p, null, 2));
  } catch (err) {
    console.error('Failed to save persisted state', err);
  }
}

let saveTimer: ReturnType<typeof setTimeout> | null = null;
let lastWritten: string | null = null;

function scheduleSave(p: Persisted): void {
  const serialized = JSON.stringify(p, null, 2);
  // Skip if nothing persistable changed since the last write.
  if (serialized === lastWritten) return;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    lastWritten = serialized;
    void savePersisted(p);
  }, 500);
}

/** Restore persisted state on launch and wire up debounced autosave. */
export function initPersistence(): void {
  void (async () => {
    const p = await loadPersisted();
    // Hydrate settings + ui immediately so the UI renders with the right theme.
    useAppStore.setState({ settings: p.settings, ui: p.ui });
    applySettingsToDom(p.settings);

    // Best-effort workspace restore. If the folder/file is gone, start fresh.
    try {
      if (p.folder) {
        const tree = await readDirTree(p.folder);
        useAppStore.getState().setWorkspace(p.folder, tree);
        void startWatching(p.folder);
      }
    } catch (err) {
      console.warn('Could not restore folder', err);
    }
    try {
      if (p.activePath) {
        const md = await readFile(p.activePath);
        useAppStore.getState().openDoc(p.activePath, md);
      }
    } catch (err) {
      console.warn('Could not restore active document', err);
    }

    // Seed lastWritten so we don't immediately re-write what we just loaded.
    lastWritten = JSON.stringify(toPersisted(useAppStore.getState()), null, 2);

    useAppStore.subscribe((state) => {
      scheduleSave(toPersisted(state));
    });
  })();
}
