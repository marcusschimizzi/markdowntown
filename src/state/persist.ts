import type { Settings, UiState } from './store';

export interface Persisted {
  settings: Settings;
  ui: UiState;
  folder: string | null;
  activePath: string | null;
}

export const DEFAULT_PERSISTED: Persisted = {
  settings: { themePref: 'system', font: 'sans', fontSize: 17, accent: '#3B6EDB', width: 'normal' },
  ui: { sidebarOpen: true, outlineOpen: true, focus: false, paletteOpen: false },
  folder: null,
  activePath: null,
};

export function toPersisted(s: {
  settings: Settings;
  ui: UiState;
  folder: string | null;
  activePath: string | null;
}): Persisted {
  return {
    settings: s.settings,
    ui: { ...s.ui, paletteOpen: false },
    folder: s.folder,
    activePath: s.activePath,
  };
}

export function fromPersisted(raw: unknown): Persisted {
  if (!raw || typeof raw !== 'object') return DEFAULT_PERSISTED;
  const r = raw as Record<string, unknown>;
  if (typeof r.settings !== 'object' || r.settings === null) return DEFAULT_PERSISTED;
  return {
    settings: { ...DEFAULT_PERSISTED.settings, ...(r.settings as object) },
    ui: { ...DEFAULT_PERSISTED.ui, ...((r.ui as object) ?? {}) },
    folder: typeof r.folder === 'string' ? r.folder : null,
    activePath: typeof r.activePath === 'string' ? r.activePath : null,
  };
}
