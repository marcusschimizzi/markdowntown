import { useEffect, useState } from "react";
import type { Editor } from "@tiptap/core";
import { AppShell } from "./components/AppShell";
import { Sidebar } from "./components/Sidebar";
import { Footer } from "./components/Footer";
import { MarkdownEditor } from "./editor/Editor";
import { maxWidthFor } from "./editor/width";
import { Outline } from "./components/Outline";
import { CommandPalette } from "./components/CommandPalette";
import type { Command } from "./components/CommandPalette";
import { getOutline, jumpToHeading } from "./editor/outline";
import type { OutlineItem } from "./editor/outline";
import { useAppStore } from "./state/store";
import { saveActiveDoc } from "./state/save";
import { pickFolder, readDir, readFile } from "./lib/fsBridge";
import { applyTheme } from "./theme/applyTheme";
import { wordStats } from "./lib/wordcount";

function App() {
  // Read store values via selectors so the UI re-renders on folder/file/theme changes.
  const files = useAppStore((s) => s.files);
  const activePath = useAppStore((s) => s.activePath);
  const markdown = useAppStore((s) => s.markdown);
  const dirty = useAppStore((s) => s.dirty);
  const theme = useAppStore((s) => s.theme);
  const width = useAppStore((s) => s.settings.width);
  const outlineOpen = useAppStore((s) => s.ui.outlineOpen);
  const paletteOpen = useAppStore((s) => s.ui.paletteOpen);

  // Hold the editor instance so we can read its rendered (plain) text for word counts.
  const [editor, setEditor] = useState<Editor | null>(null);
  const [stats, setStats] = useState({ words: 0, chars: 0, readingMinutes: 1 });
  const [outline, setOutline] = useState<OutlineItem[]>([]);

  // Recompute word stats from the editor's RENDERED text so markdown syntax
  // (#, **, backticks) doesn't inflate counts. React runs child effects before
  // parent effects, so the editor's own load effect has already applied the new
  // content by the time this reads getText() — counts stay correct on both edits
  // and programmatic file switches. activePath in the deps re-runs on file switch.
  useEffect(() => {
    if (editor) setStats(wordStats(editor.getText()));
  }, [editor, markdown, activePath]);

  // Recompute the outline reactively from the editor doc. Same timing rationale as
  // the word-count effect above: the editor's load effect runs first, so getOutline
  // reads the up-to-date doc on edits and file switches.
  useEffect(() => {
    if (editor) setOutline(getOutline(editor));
  }, [editor, markdown, activePath]);

  // Global keyboard shortcuts: ⌘S save, ⌘K palette toggle, Esc closes palette.
  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        void saveActiveDoc();
      } else if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const open = useAppStore.getState().ui.paletteOpen;
        useAppStore.getState().setPalette(!open);
      } else if (e.key === "Escape" && useAppStore.getState().ui.paletteOpen) {
        useAppStore.getState().setPalette(false);
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  async function handleOpenFolder() {
    const folder = await pickFolder();
    if (!folder) return;
    const dirFiles = await readDir(folder);
    useAppStore.getState().setFolder(folder, dirFiles);
  }

  async function handleOpen(path: string) {
    const md = await readFile(path);
    useAppStore.getState().openDoc(path, md);
  }

  function handleToggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    useAppStore.getState().setTheme(next);
    applyTheme(next);
  }

  // Placeholder: the full new-document flow is implemented in a later task.
  function handleNew() {
    console.log("new");
  }

  // Commands surfaced in the ⌘K palette. Static labels are fine for v1.
  const commands: Command[] = [
    { id: "outline", label: "Toggle outline", hint: "⌘⌥O", run: () => useAppStore.getState().toggleOutline() },
    { id: "theme", label: "Switch theme", hint: "⌘⇧L", run: () => handleToggleTheme() },
    { id: "focus", label: "Toggle focus mode", hint: "⌘⇧F", run: () => useAppStore.getState().toggleFocus() },
    { id: "new", label: "New document", hint: "⌘N", run: () => handleNew() },
    { id: "sidebar", label: "Toggle sidebar", hint: "⌘\\", run: () => useAppStore.getState().toggleSidebar() },
    { id: "open-folder", label: "Open folder", run: () => void handleOpenFolder() },
  ];

  return (
    <AppShell
      sidebar={
        <Sidebar
          files={files}
          activePath={activePath}
          onOpen={handleOpen}
          onOpenFolder={handleOpenFolder}
          onNew={handleNew}
          onToggleTheme={handleToggleTheme}
          isDark={theme === "dark"}
        />
      }
      toolbar={<span style={{ color: "var(--ink2)" }}>Untitled.md</span>}
      footer={
        <Footer
          words={stats.words}
          chars={stats.chars}
          readingMinutes={stats.readingMinutes}
          saved={dirty ? "Saving…" : "Saved"}
        />
      }
    >
      {activePath ? (
        <>
          <div className="editor-scroll">
            <div className="editor-column" style={{ maxWidth: maxWidthFor(width) }}>
              <MarkdownEditor
                key={activePath}
                markdown={markdown}
                onChange={(md) => useAppStore.getState().setMarkdown(md)}
                onReady={setEditor}
              />
            </div>
          </div>
          {outlineOpen && (
            <Outline
              items={outline}
              activeIndex={0}
              onJump={(pos) => editor && jumpToHeading(editor, pos)}
            />
          )}
        </>
      ) : (
        <div style={{ flex: 1, padding: "48px 32px", color: "var(--muted)" }}>
          Open a file to start editing.
        </div>
      )}
      {paletteOpen && (
        <CommandPalette
          files={files}
          commands={commands}
          onOpenFile={(path) => handleOpen(path)}
          onClose={() => useAppStore.getState().setPalette(false)}
        />
      )}
    </AppShell>
  );
}

export default App;
