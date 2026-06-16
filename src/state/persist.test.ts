import { describe, it, expect } from 'vitest';
import { toPersisted, fromPersisted, DEFAULT_PERSISTED } from './persist';

describe('persistence shape', () => {
  it('round-trips settings + ui + folder', () => {
    const snapshot = {
      settings: { themePref: 'dark', font: 'serif', fontSize: 18, accent: '#B45B36', width: 'wide' },
      ui: { sidebarOpen: false, outlineOpen: true, focus: false, paletteOpen: false },
      folder: '/x', activePath: '/x/a.md',
    } as const;
    const json = JSON.stringify(toPersisted(snapshot));
    const back = fromPersisted(JSON.parse(json));
    expect(back.settings.font).toBe('serif');
    expect(back.ui.sidebarOpen).toBe(false);
    expect(back.folder).toBe('/x');
  });

  it('falls back to defaults for malformed input', () => {
    expect(fromPersisted(null)).toEqual(DEFAULT_PERSISTED);
    expect(fromPersisted({ settings: 'nope' })).toEqual(DEFAULT_PERSISTED);
  });
});
