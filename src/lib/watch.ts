import { listen } from '@tauri-apps/api/event';
import { readDirTree, readFile, watchDir } from './fsBridge';
import { useAppStore } from '../state/store';

export function shouldReload(
  s: { activePath: string | null; dirty: boolean },
  changedPaths: string[],
): boolean {
  if (!s.activePath || s.dirty) return false;
  return changedPaths.includes(s.activePath);
}

interface FsChange {
  paths: string[];
  kind: string;
}

/** Start watching the folder and reconcile the sidebar + active doc on changes. */
export async function startWatching(folder: string): Promise<() => void> {
  const unlisten = await listen<FsChange>('fs-change', async (event) => {
    const store = useAppStore.getState();
    // refresh sidebar listing (re-read the tree; setWorkspace repopulates the flat files too)
    if (store.folder) store.setWorkspace(store.folder, await readDirTree(store.folder));
    // reload active doc if it changed externally and we have no unsaved edits
    if (shouldReload({ activePath: store.activePath, dirty: store.dirty }, event.payload.paths)) {
      const md = await readFile(store.activePath!);
      store.openDoc(store.activePath!, md);
    }
  });
  await watchDir(folder);
  return unlisten;
}
