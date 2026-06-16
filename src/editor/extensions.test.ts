import { describe, it, expect, afterEach } from 'vitest';
import { Editor } from '@tiptap/core';
import { extensions } from './extensions';
import { typeWithTrigger } from '../test/typeInEditor';

describe('editor extensions', () => {
  let editor: Editor;
  afterEach(() => editor?.destroy());

  it('converts a markdown link via the custom input rule', () => {
    editor = new Editor({ extensions, content: '<p></p>' });
    // Typing "[site](https://x.com)" should leave a link whose text is "site".
    typeWithTrigger(editor, '[site](https://x.com', ')');
    const html = editor.getHTML();
    expect(html).toContain('href="https://x.com"');
    expect(html).toContain('>site<');
  });

  it('converts markdown headings for levels 1-3', () => {
    editor = new Editor({ extensions, content: '<p></p>' });
    // "### " (hash + space) should become an h3 via StarterKit's heading rule.
    typeWithTrigger(editor, '###', ' ');
    expect(editor.getHTML()).toContain('<h3');
  });

  it('limits headings to levels 1-3', () => {
    editor = new Editor({ extensions, content: '<p></p>' });
    // "#### " is a level-4 marker; the rule only fires for 1-3, so no <h4>.
    typeWithTrigger(editor, '####', ' ');
    expect(editor.getHTML()).not.toContain('<h4');
  });
});
