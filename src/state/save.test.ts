import { describe, it, expect, vi, beforeEach } from 'vitest';

const writeFile = vi.fn();
vi.mock('../lib/fsBridge', () => ({ writeFile: (...a: unknown[]) => writeFile(...a) }));

import { useAppStore } from './store';
import { saveActiveDoc } from './save';

beforeEach(() => {
  useAppStore.setState(useAppStore.getInitialState(), true);
  writeFile.mockReset().mockResolvedValue(undefined);
});

describe('saveActiveDoc', () => {
  it('writes the active markdown and clears dirty', async () => {
    useAppStore.getState().openDoc('/x/a.md', '# A');
    useAppStore.getState().setMarkdown('# A edited');
    await saveActiveDoc();
    expect(writeFile).toHaveBeenCalledWith('/x/a.md', '# A edited');
    expect(useAppStore.getState().dirty).toBe(false);
  });

  it('no-ops when there is no active path', async () => {
    await saveActiveDoc();
    expect(writeFile).not.toHaveBeenCalled();
  });
});
