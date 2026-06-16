import { create } from 'zustand';
import type { FileEntry } from '../lib/types';

export type ResolvedTheme = 'light' | 'dark';
export type ThemePref = 'light' | 'dark' | 'system';
export type Width = 'narrow' | 'normal' | 'wide';
export type EditorFont = 'serif' | 'sans' | 'mono';

export interface Settings {
  themePref: ThemePref;
  font: EditorFont;
  fontSize: number;
  accent: string;
  width: Width;
}

export interface UiState {
  sidebarOpen: boolean;
  outlineOpen: boolean;
  focus: boolean;
  paletteOpen: boolean;
}

export interface AppState {
  folder: string | null;
  files: FileEntry[];
  activePath: string | null;
  markdown: string;
  dirty: boolean;
  theme: ResolvedTheme;
  settings: Settings;
  ui: UiState;

  setFolder(folder: string, files: FileEntry[]): void;
  setFiles(files: FileEntry[]): void;
  openDoc(path: string, markdown: string): void;
  setMarkdown(md: string): void;
  markSaved(): void;
  setTheme(theme: ResolvedTheme): void;
  applySettings(partial: Partial<Settings>): void;
  toggleSidebar(): void;
  toggleOutline(): void;
  toggleFocus(): void;
  setPalette(open: boolean): void;
}

const defaultSettings: Settings = {
  themePref: 'system', font: 'sans', fontSize: 17, accent: '#3B6EDB', width: 'normal',
};

export const useAppStore = create<AppState>()((set) => ({
  folder: null,
  files: [],
  activePath: null,
  markdown: '',
  dirty: false,
  theme: 'light',
  settings: defaultSettings,
  ui: { sidebarOpen: true, outlineOpen: true, focus: false, paletteOpen: false },

  setFolder: (folder, files) => set({ folder, files }),
  setFiles: (files) => set({ files }),
  openDoc: (activePath, markdown) => set({ activePath, markdown, dirty: false }),
  setMarkdown: (markdown) => set({ markdown, dirty: true }),
  markSaved: () => set({ dirty: false }),
  setTheme: (theme) => set({ theme }),
  applySettings: (partial) => set((s) => ({ settings: { ...s.settings, ...partial } })),
  toggleSidebar: () => set((s) => ({ ui: { ...s.ui, sidebarOpen: !s.ui.sidebarOpen } })),
  toggleOutline: () => set((s) => ({ ui: { ...s.ui, outlineOpen: !s.ui.outlineOpen } })),
  toggleFocus: () => set((s) => ({ ui: { ...s.ui, focus: !s.ui.focus } })),
  setPalette: (paletteOpen) => set((s) => ({ ui: { ...s.ui, paletteOpen } })),
}));
