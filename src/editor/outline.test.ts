import { describe, it, expect, afterEach } from 'vitest';
import { Editor } from '@tiptap/core';
import { extensions } from './extensions';
import { getOutline } from './outline';

describe('getOutline', () => {
  let editor: Editor;
  afterEach(() => editor?.destroy());

  it('extracts headings with level, text, and position', () => {
    editor = new Editor({ extensions, content: '<h1>Title</h1><p>x</p><h2>Sub</h2>' });
    const outline = getOutline(editor);
    expect(outline.map((h) => [h.level, h.text])).toEqual([[1, 'Title'], [2, 'Sub']]);
    expect(outline[0].pos).toBeLessThan(outline[1].pos);
  });

  it('returns empty for a doc with no headings', () => {
    editor = new Editor({ extensions, content: '<p>just text</p>' });
    expect(getOutline(editor)).toEqual([]);
  });
});
