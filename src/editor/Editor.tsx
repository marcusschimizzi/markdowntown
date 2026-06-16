import { useEditor, EditorContent } from '@tiptap/react';
import { useEffect, useRef } from 'react';
import { extensions } from './extensions';
import { loadMarkdown, serializeMarkdown } from './markdown';
import type { Editor } from '@tiptap/core';
import './editor.css';

interface Props {
  markdown: string;
  onChange: (markdown: string) => void;
  onReady?: (editor: Editor) => void;
}

export function MarkdownEditor({ markdown, onChange, onReady }: Props) {
  const loadedFor = useRef<string | null>(null);
  const editor = useEditor({
    extensions,
    immediatelyRender: false,
    autofocus: true,
    editorProps: { attributes: { role: 'textbox', 'aria-multiline': 'true', class: 'mde' } },
    onUpdate: ({ editor }) => {
      const md = serializeMarkdown(editor);
      loadedFor.current = md; // prevents the controlled prop feedback from triggering a reload
      onChange(md);
    },
  });

  // Load markdown when the editor is ready or the source doc changes.
  useEffect(() => {
    if (!editor) return;
    if (loadedFor.current !== markdown) {
      loadMarkdown(editor, markdown);
      loadedFor.current = markdown;
    }
    onReady?.(editor);
  }, [editor, markdown, onReady]);

  // Typewriter scroll: when focus mode is on (data-focus="1" on .editor-scroll),
  // keep the active block centered vertically on every selection change. This is
  // DOM/layout-driven, so it isn't unit-tested (jsdom can't compute layout).
  useEffect(() => {
    if (!editor) return;
    const onSel = () => {
      const root = editor.view.dom as HTMLElement;
      const active = root.querySelector('.activeblk') as HTMLElement | null;
      const scroller = root.closest('.editor-scroll') as HTMLElement | null;
      if (!active || !scroller || scroller.dataset.focus !== '1') return;
      const sr = scroller.getBoundingClientRect();
      const ar = active.getBoundingClientRect();
      const delta = (ar.top + Math.min(ar.height, 60) / 2) - (sr.top + sr.height / 2);
      if (Math.abs(delta) > 2) scroller.scrollBy({ top: delta, behavior: 'smooth' });
    };
    editor.on('selectionUpdate', onSel);
    return () => { editor.off('selectionUpdate', onSel); };
  }, [editor]);

  if (!editor) return null;
  return <EditorContent editor={editor} />;
}
