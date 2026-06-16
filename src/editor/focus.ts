import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import type { EditorState } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

export interface BlockRange { from: number; to: number; }

/** The top-level block node range that contains the current selection head. */
export function activeBlockRange(state: EditorState): BlockRange | null {
  const { $from } = state.selection;
  const depth = 1; // top-level block under doc
  if ($from.depth < depth) return null;
  const from = $from.before(depth);
  const node = state.doc.nodeAt(from);
  if (!node) return null;
  return { from, to: from + node.nodeSize };
}

export const focusModeKey = new PluginKey('focusMode');

/** Adds class "activeblk" to the block holding the selection. CSS dims the rest. */
export const FocusMode = Extension.create({
  name: 'focusMode',
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: focusModeKey,
        props: {
          decorations(state) {
            const range = activeBlockRange(state);
            if (!range) return DecorationSet.empty;
            return DecorationSet.create(state.doc, [
              Decoration.node(range.from, range.to, { class: 'activeblk' }),
            ]);
          },
        },
      }),
    ];
  },
});
