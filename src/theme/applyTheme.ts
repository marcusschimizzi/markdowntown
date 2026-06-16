import type { ResolvedTheme } from '../state/store';

export function applyTheme(theme: ResolvedTheme): void {
  document.documentElement.setAttribute('data-theme', theme);
}
