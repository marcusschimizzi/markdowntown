import type { Settings, ThemePref, ResolvedTheme, EditorFont } from '../state/store';
import { applyTheme } from '../theme/applyTheme';

/** Resolve a theme preference into a concrete light/dark value. */
export function resolveTheme(pref: ThemePref): ResolvedTheme {
  if (pref === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return pref;
}

const FONT_STACKS: Record<EditorFont, string> = {
  serif: "'Newsreader', Georgia, serif",
  sans: 'system-ui, -apple-system, sans-serif',
  mono: "'JetBrains Mono', monospace",
};

/** Parse a #RRGGBB hex into [r, g, b]. */
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function rgba(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

/**
 * Apply settings live by setting theme + CSS custom properties on the document root.
 * The editor consumes --editor-font / --editor-size and the tokens consume --accent.
 */
export function applySettingsToDom(settings: Settings): void {
  applyTheme(resolveTheme(settings.themePref));

  const root = document.documentElement.style;
  root.setProperty('--accent', settings.accent);
  root.setProperty('--accentSoft', rgba(settings.accent, 0.12));
  root.setProperty('--accentBorder', rgba(settings.accent, 0.42));
  root.setProperty('--editor-font', FONT_STACKS[settings.font]);
  root.setProperty('--editor-size', `${settings.fontSize}px`);
}
