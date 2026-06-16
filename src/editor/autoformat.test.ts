import { describe, it, expect, afterEach } from 'vitest';
import { Editor } from '@tiptap/core';
import { extensions } from './extensions';
import { typeWithTrigger } from '../test/typeInEditor';

// These tests lock in StarterKit's live Markdown autoformat (input-rule)
// behavior so a future dependency bump can't silently break it. Input rules
// fire from real keystrokes via `handleTextInput`, not from a bulk
// `insertContent` call — so each block test types the marker, fires the trigger
// keystroke, then types the body. See `../test/typeInEditor` for the helper.
describe('live markdown autoformat', () => {
  let editor: Editor;
  afterEach(() => editor?.destroy());

  it('turns "## " into an h2 (space is the trigger)', () => {
    editor = new Editor({ extensions, content: '<p></p>' });
    // The block rule fires on the space after "##"; the heading text follows.
    typeWithTrigger(editor, '##', ' ');
    editor.commands.insertContent('Heading');
    const html = editor.getHTML();
    expect(html).toContain('<h2');
    expect(html).toContain('>Heading</h2>');
  });

  it('turns "- " into a bullet list (space is the trigger)', () => {
    editor = new Editor({ extensions, content: '<p></p>' });
    typeWithTrigger(editor, '-', ' ');
    editor.commands.insertContent('item');
    const html = editor.getHTML();
    expect(html).toContain('<ul>');
    expect(html).toContain('<li>');
    expect(html).toContain('item');
  });

  it('turns "> " into a blockquote (space is the trigger)', () => {
    editor = new Editor({ extensions, content: '<p></p>' });
    typeWithTrigger(editor, '>', ' ');
    editor.commands.insertContent('quote');
    const html = editor.getHTML();
    expect(html).toContain('<blockquote>');
    expect(html).toContain('quote');
  });

  it('turns "**bold**" into <strong> (the closing * is the trigger)', () => {
    editor = new Editor({ extensions, content: '<p></p>' });
    // The inline mark rule fires the moment the closing delimiter completes:
    // body "**bold*" + trigger "*". A trailing space does NOT fire it.
    typeWithTrigger(editor, '**bold*', '*');
    expect(editor.getHTML()).toContain('<strong>bold</strong>');
  });

  it('applies bold via the keyboard command (not an input rule)', () => {
    editor = new Editor({ extensions, content: '<p></p>' });
    // toggleBold is a command, so plain insertContent is fine here — no rule.
    editor.commands.insertContent('hello');
    editor.commands.selectAll();
    editor.commands.toggleBold();
    expect(editor.getHTML()).toContain('<strong>hello</strong>');
  });
});
