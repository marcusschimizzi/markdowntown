import { describe, it, expect, afterEach } from 'vitest';
import { Editor } from '@tiptap/core';
import { extensions } from './extensions';

// TipTap input rules fire from real keystrokes via the editor's
// `handleTextInput` prop, not from a bulk `insertContent` call (which inserts
// plain text without running input rules synchronously). To exercise the rules
// in a headless test, we type the body of the markdown syntax and then feed the
// final trigger character through `handleTextInput` exactly as the browser would.
function typeWithTrigger(editor: Editor, body: string, trigger: string) {
  editor.commands.insertContent(body);
  const pos = editor.state.selection.from;
  // ProseMirror's handleTextInput signature is (view, from, to, text, default).
  // The default callback is unused by TipTap's input-rule runner; pass a no-op.
  editor.view.someProp('handleTextInput', (fn) =>
    fn(editor.view, pos, pos, trigger, () => editor.state.tr),
  );
}

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
