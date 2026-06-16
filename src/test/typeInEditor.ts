import type { Editor } from '@tiptap/core';

// TipTap input rules fire from real keystrokes via the editor's
// `handleTextInput` prop, not from a bulk `insertContent` call (which inserts
// plain text without running input rules synchronously). To exercise the rules
// in a headless test, we type the body of the markdown syntax and then feed the
// final trigger character through `handleTextInput` exactly as the browser would.
export function typeWithTrigger(editor: Editor, body: string, trigger: string) {
  editor.commands.insertContent(body);
  const pos = editor.state.selection.from;
  // ProseMirror's handleTextInput signature is (view, from, to, text, default).
  // The default callback is unused by TipTap's input-rule runner; pass a no-op.
  editor.view.someProp('handleTextInput', (fn) =>
    fn(editor.view, pos, pos, trigger, () => editor.state.tr),
  );
}

// Convenience wrapper: types `text` into the editor and treats the final
// character as the trigger keystroke that runs input rules. This mirrors a user
// typing the whole string left-to-right, where the last character is what fires
// the rule (e.g. the space after "## ", or the ")" closing a markdown link).
export function typeMarkdown(editor: Editor, text: string) {
  if (text.length === 0) return;
  const body = text.slice(0, -1);
  const trigger = text.slice(-1);
  typeWithTrigger(editor, body, trigger);
}
