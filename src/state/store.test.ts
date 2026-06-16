import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from './store';

beforeEach(() => {
  useAppStore.setState(useAppStore.getInitialState(), true);
});

describe('useAppStore', () => {
  it('opens a doc clean and marks dirty on edit', () => {
    useAppStore.getState().openDoc('/x/a.md', '# A');
    expect(useAppStore.getState().activePath).toBe('/x/a.md');
    expect(useAppStore.getState().markdown).toBe('# A');
    expect(useAppStore.getState().dirty).toBe(false);

    useAppStore.getState().setMarkdown('# A edited');
    expect(useAppStore.getState().dirty).toBe(true);

    useAppStore.getState().markSaved();
    expect(useAppStore.getState().dirty).toBe(false);
  });

  it('sets a folder with its files', () => {
    useAppStore.getState().setFolder('/x', [{ name: 'a.md', path: '/x/a.md', isDir: false }]);
    expect(useAppStore.getState().folder).toBe('/x');
    expect(useAppStore.getState().files).toHaveLength(1);
  });

  it('toggles ui flags', () => {
    const before = useAppStore.getState().ui.outlineOpen;
    useAppStore.getState().toggleOutline();
    expect(useAppStore.getState().ui.outlineOpen).toBe(!before);
  });

  it('applies settings partially', () => {
    useAppStore.getState().applySettings({ width: 'wide' });
    expect(useAppStore.getState().settings.width).toBe('wide');
  });
});
