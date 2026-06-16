import { describe, it, expect, afterEach } from 'vitest';
import { Editor } from '@tiptap/core';
import { extensions } from './extensions';
import { activeBlockRange } from './focus';

describe('activeBlockRange', () => {
  let editor: Editor;
  afterEach(() => editor?.destroy());

  it('returns the top-level block containing the selection', () => {
    editor = new Editor({ extensions, content: '<p>first</p><p>second</p>' });
    // place caret inside the second paragraph
    editor.commands.setTextSelection(10);
    const range = activeBlockRange(editor.state);
    expect(range).not.toBeNull();
    const node = editor.state.doc.nodeAt(range!.from);
    expect(node?.textContent).toBe('second');
  });
});
