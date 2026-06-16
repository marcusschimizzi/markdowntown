import type { Editor } from '@tiptap/core';

export interface OutlineItem {
  level: number;
  text: string;
  pos: number;
  index: number;
}

/** Extract all headings from the editor doc, in document order. */
export function getOutline(editor: Editor): OutlineItem[] {
  const items: OutlineItem[] = [];
  let index = 0;
  editor.state.doc.descendants((node, pos) => {
    if (node.type.name === 'heading') {
      items.push({
        level: Number(node.attrs.level),
        text: node.textContent || 'Untitled',
        pos,
        index: index++,
      });
    }
    return true;
  });
  return items;
}

/** Scroll/select to a heading position. */
export function jumpToHeading(editor: Editor, pos: number): void {
  editor.chain().focus().setTextSelection(pos + 1).scrollIntoView().run();
}
