import type { Editor } from '@tiptap/core';

/** Replace the editor's content with parsed markdown. */
export function loadMarkdown(editor: Editor, md: string): void {
  editor.commands.setContent(md, { contentType: 'markdown' });
}

/** Serialize the current doc to canonical markdown (source of truth on disk). */
export function serializeMarkdown(editor: Editor): string {
  return editor.getMarkdown();
}
