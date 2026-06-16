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

  if (!editor) return null;
  return <EditorContent editor={editor} />;
}
