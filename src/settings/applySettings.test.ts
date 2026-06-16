import { describe, it, expect, beforeEach } from 'vitest';
import { resolveTheme, applySettingsToDom } from './applySettings';
import type { Settings } from '../state/store';

describe('resolveTheme', () => {
  it('passes light through', () => {
    expect(resolveTheme('light')).toBe('light');
  });
  it('passes dark through', () => {
    expect(resolveTheme('dark')).toBe('dark');
  });
});

describe('applySettingsToDom', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('style');
  });

  it('sets accent, editor font, editor size, and theme', () => {
    const settings: Settings = {
      themePref: 'dark', font: 'serif', fontSize: 18, accent: '#B45B36', width: 'normal',
    };
    applySettingsToDom(settings);

    const style = document.documentElement.style;
    expect(style.getPropertyValue('--accent')).toBe('#B45B36');
    expect(style.getPropertyValue('--editor-font')).toContain('Newsreader');
    expect(style.getPropertyValue('--editor-size')).toBe('18px');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
