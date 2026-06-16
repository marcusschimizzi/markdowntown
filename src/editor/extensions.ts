import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Markdown } from '@tiptap/markdown';
import { InputRule } from '@tiptap/core';
import type { Extensions } from '@tiptap/core';

// [text](url) -> link mark. Link has no built-in input rule, so add one.
// We use a custom InputRule handler (rather than the generic markInputRule)
// because markInputRule keeps the *last* capture group (the URL) as the visible
// text. We want the link text ("site") visible with the URL as the href.
const LinkWithInputRule = Link.extend({
  addInputRules() {
    const type = this.type;
    return [
      new InputRule({
        find: /\[([^\]]+)]\(([^)\s]+)\)$/,
        handler: ({ state, range, match }) => {
          const [, text, href] = match;
          const { tr } = state;
          // Replace the whole "[text](url)" match with just "text".
          tr.insertText(text, range.from, range.to);
          // Apply the link mark to the inserted text.
          tr.addMark(range.from, range.from + text.length, type.create({ href }));
          tr.removeStoredMark(type);
        },
      }),
    ];
  },
}).configure({ openOnClick: false, autolink: true });

export const extensions: Extensions = [
  StarterKit.configure({
    heading: { levels: [1, 2, 3] },
    link: false, // disable bundled Link so our input-rule version wins (no duplicate warning)
  }),
  LinkWithInputRule,
  Markdown.configure({
    indentation: { style: 'space', size: 2 },
    markedOptions: { gfm: true, breaks: false, pedantic: false },
  }),
];
