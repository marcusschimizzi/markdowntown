import { describe, it, expect, beforeEach } from 'vitest';
import { applyTheme } from './applyTheme';

describe('applyTheme', () => {
  beforeEach(() => { document.documentElement.removeAttribute('data-theme'); });

  it('sets data-theme=dark on the root', () => {
    applyTheme('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('sets data-theme=light on the root', () => {
    applyTheme('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });
});
