import type { FileEntry } from './types';

export function markdownFiles(entries: FileEntry[]): FileEntry[] {
  return entries.filter(
    (e) => !e.isDir && /\.(md|markdown)$/i.test(e.name)
  );
}

export function baseName(path: string): string {
  const file = path.split('/').pop() ?? path;
  return file.replace(/\.(md|markdown)$/i, '');
}
