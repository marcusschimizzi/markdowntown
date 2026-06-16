import { useAppStore } from './store';
import { writeFile } from '../lib/fsBridge';

export async function saveActiveDoc(): Promise<void> {
  const { activePath, markdown } = useAppStore.getState();
  if (!activePath) return;
  await writeFile(activePath, markdown);
  useAppStore.getState().markSaved();
}
