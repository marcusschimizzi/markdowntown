import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import type { FileEntry, TreeNode } from './types';

export const readDir = (path: string) => invoke<FileEntry[]>('read_dir', { path });
export const readDirTree = (path: string) => invoke<TreeNode>('read_dir_tree', { path });
export const readFile = (path: string) => invoke<string>('read_file', { path });
export const writeFile = (path: string, contents: string) =>
  invoke<void>('write_file', { path, contents });
export const createFile = (path: string, contents: string) =>
  invoke<void>('create_file', { path, contents });
export const createDir = (path: string) => invoke<void>('create_dir', { path });
export const renamePath = (from: string, to: string) =>
  invoke<void>('rename_path', { from, to });
export const deletePath = (path: string) => invoke<void>('delete_path', { path });
export const watchDir = (path: string) => invoke<void>('watch_dir', { path });

export async function pickFolder(): Promise<string | null> {
  const res = await open({ directory: true, multiple: false });
  return typeof res === 'string' ? res : null;
}

export async function pickFile(): Promise<string | null> {
  const res = await open({ directory: false, multiple: false,
    filters: [{ name: 'Markdown', extensions: ['md', 'markdown'] }] });
  return typeof res === 'string' ? res : null;
}
