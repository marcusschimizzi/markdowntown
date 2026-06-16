import { emit, listen } from '@tauri-apps/api/event';
import type { UnlistenFn } from '@tauri-apps/api/event';
import type { Settings } from '../state/store';

const EVENT = 'settings-changed';

/** Broadcast a partial settings change to all windows (incl. the main editor). */
export function broadcastSettings(partial: Partial<Settings>): Promise<void> {
  return emit(EVENT, partial);
}

/** Subscribe to settings changes; returns a Promise of the unlisten fn. */
export function onSettingsChanged(cb: (partial: Partial<Settings>) => void): Promise<UnlistenFn> {
  return listen<Partial<Settings>>(EVENT, (e) => cb(e.payload));
}
