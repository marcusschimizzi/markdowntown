import { describe, it, expect, afterEach } from 'vitest';
import { Editor } from '@tiptap/core';
import { extensions } from './extensions';
import { loadMarkdown, serializeMarkdown } from './markdown';

function makeEditor() {
  return new Editor({ extensions, content: '' });
}

describe('markdown round-trip', () => {
  let editor: Editor;
  afterEach(() => editor?.destroy());

  const cases = [
    '# Title',
    'Some **bold** and *italic* and `code` and ~~strike~~.',
    '- one\n- two\n- three',
    '> a quote',
    '[link](https://example.com)',
  ];

  it.each(cases)('is idempotent for: %s', (md) => {
    editor = makeEditor();
    loadMarkdown(editor, md);
    const once = serializeMarkdown(editor);
    loadMarkdown(editor, once);
    const twice = serializeMarkdown(editor);
    expect(twice).toBe(once); // fixed point after first normalization
  });

  it('preserves strikethrough through a round-trip', () => {
    editor = makeEditor();
    loadMarkdown(editor, 'a ~~b~~ c');
    expect(serializeMarkdown(editor)).toContain('~~b~~');
  });

  it('preserves a heading and its text', () => {
    editor = makeEditor();
    loadMarkdown(editor, '## Three habits');
    const out = serializeMarkdown(editor);
    expect(out).toContain('Three habits');
    expect(out.trimStart().startsWith('##')).toBe(true);
  });
});
