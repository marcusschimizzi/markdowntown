import { describe, it, expect, vi, beforeEach } from 'vitest';

const invoke = vi.fn();
const open = vi.fn();
vi.mock('@tauri-apps/api/core', () => ({ invoke: (...a: unknown[]) => invoke(...a) }));
vi.mock('@tauri-apps/plugin-dialog', () => ({ open: (...a: unknown[]) => open(...a) }));

import { readDir, readFile, writeFile, pickFolder, pickFile } from './fsBridge';

beforeEach(() => { invoke.mockReset(); open.mockReset(); });

describe('fsBridge', () => {
  it('readDir invokes read_dir with the path', async () => {
    invoke.mockResolvedValue([{ name: 'a.md', path: '/x/a.md', isDir: false }]);
    const res = await readDir('/x');
    expect(invoke).toHaveBeenCalledWith('read_dir', { path: '/x' });
    expect(res[0].name).toBe('a.md');
  });

  it('readFile invokes read_file', async () => {
    invoke.mockResolvedValue('# hi');
    expect(await readFile('/x/a.md')).toBe('# hi');
    expect(invoke).toHaveBeenCalledWith('read_file', { path: '/x/a.md' });
  });

  it('writeFile invokes write_file with contents', async () => {
    invoke.mockResolvedValue(undefined);
    await writeFile('/x/a.md', '# hi');
    expect(invoke).toHaveBeenCalledWith('write_file', { path: '/x/a.md', contents: '# hi' });
  });

  it('pickFolder returns the chosen string and null on cancel', async () => {
    open.mockResolvedValue('/picked');
    expect(await pickFolder()).toBe('/picked');
    open.mockResolvedValue(null);
    expect(await pickFolder()).toBeNull();
  });

  it('pickFile opens a file picker with markdown filters and null on cancel', async () => {
    open.mockResolvedValue('/picked/a.md');
    expect(await pickFile()).toBe('/picked/a.md');
    expect(open).toHaveBeenCalledWith({
      directory: false,
      multiple: false,
      filters: [{ name: 'Markdown', extensions: ['md', 'markdown'] }],
    });
    open.mockResolvedValue(null);
    expect(await pickFile()).toBeNull();
  });
});
