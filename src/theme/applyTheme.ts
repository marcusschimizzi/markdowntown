type ResolvedTheme = 'light' | 'dark';

export function applyTheme(theme: ResolvedTheme): void {
  document.documentElement.setAttribute('data-theme', theme);
}
