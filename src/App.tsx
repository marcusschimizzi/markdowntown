import { useEffect, useRef, useState } from "react";
import type { Editor } from "@tiptap/core";
import { AppShell } from "./components/AppShell";
import { Sidebar } from "./components/Sidebar";
import { Toolbar } from "./components/Toolbar";
import { Footer } from "./components/Footer";
import { MarkdownEditor } from "./editor/Editor";
import { maxWidthFor } from "./editor/width";
import { Outline } from "./components/Outline";
import { CommandPalette } from "./components/CommandPalette";
import type { Command } from "./components/CommandPalette";
import { EmptyState } from "./components/EmptyState";
import { getOutline, jumpToHeading } from "./editor/outline";
import type { OutlineItem } from "./editor/outline";
import { useAppStore } from "./state/store";
import { saveActiveDoc } from "./state/save";
import { pickFolder, pickFile, readDirTree, readFile, createFile } from "./lib/fsBridge";
import { baseName } from "./lib/mdFiles";
import { startWatching } from "./lib/watch";
import { applyTheme } from "./theme/applyTheme";
import { nextUntitledName } from "./state/newDoc";
import { wordStats } from "./lib/wordcount";
import { openSettings } from "./lib/windows";
import { onSettingsChanged } from "./settings/settingsBridge";
import { applySettingsToDom } from "./settings/applySettings";

function App() {
  // Read store values via selectors so the UI re-renders on folder/file/theme changes.
  const files = useAppStore((s) => s.files);
  const folder = useAppStore((s) => s.folder);
  const tree = useAppStore((s) => s.tree);
  const activePath = useAppStore((s) => s.activePath);
  const markdown = useAppStore((s) => s.markdown);
  const dirty = useAppStore((s) => s.dirty);
  const theme = useAppStore((s) => s.theme);
  const width = useAppStore((s) => s.settings.width);
  const outlineOpen = useAppStore((s) => s.ui.outlineOpen);
  const paletteOpen = useAppStore((s) => s.ui.paletteOpen);
  const focus = useAppStore((s) => s.ui.focus);
  const sidebarOpen = useAppStore((s) => s.ui.sidebarOpen);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const toggleOutline = useAppStore((s) => s.toggleOutline);
  const toggleFocus = useAppStore((s) => s.toggleFocus);

  // Hold the editor instance so we can read its rendered (plain) text for word counts.
  const [editor, setEditor] = useState<Editor | null>(null);

  // Hold the current fs-change unlisten so we can detach the previous watcher
  // before starting a new one (on re-open) and on unmount — avoids leaking listeners.
  const unwatchRef = useRef<(() => void) | null>(null);
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

  // Global keyboard shortcuts. The effect has [] deps so it binds once; every
  // handler reads fresh state via useAppStore.getState() rather than closing over
  // stale render values.
  //   ⌘S   save            ⌘N    new document       ⌘\\   toggle sidebar
  //   ⌘K   palette toggle  ⌘⇧L  switch theme        ⌘⌥O  toggle outline
  //   ⌘O   open file        ⌘⇧F focus mode          ⌘,   settings
  //   Esc  close palette
  // ⌘⌥O matches e.code === "KeyO": on macOS, holding Option remaps e.key
  // (Option+O → "ø"), so e.key would never equal "o". The physical-key code is
  // unaffected by Option. The other shortcuts use e.key. ⌘⇧F and ⌘⇧L don't
  // collide because they test different letters.
  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === "s") {
        e.preventDefault();
        void saveActiveDoc();
      } else if (mod && e.key === "n") {
        e.preventDefault();
        void handleNew();
      } else if (mod && !e.shiftKey && e.key === "o") {
        e.preventDefault();
        void handleOpenFile();
      } else if (mod && e.key === "k") {
        e.preventDefault();
        const open = useAppStore.getState().ui.paletteOpen;
        useAppStore.getState().setPalette(!open);
      } else if (mod && e.shiftKey && e.key.toLowerCase() === "f") {
        e.preventDefault();
        useAppStore.getState().toggleFocus();
      } else if (mod && e.shiftKey && e.key.toLowerCase() === "l") {
        e.preventDefault();
        handleToggleTheme();
      } else if (mod && e.altKey && e.code === "KeyO") {
        e.preventDefault();
        useAppStore.getState().toggleOutline();
      } else if (mod && e.key === "\\") {
        e.preventDefault();
        useAppStore.getState().toggleSidebar();
      } else if (mod && e.key === ",") {
        e.preventDefault();
        void openSettings();
      } else if (e.key === "Escape" && useAppStore.getState().ui.paletteOpen) {
        useAppStore.getState().setPalette(false);
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Detach the active fs-change watcher when the app unmounts.
  useEffect(() => () => unwatchRef.current?.(), []);

  // Apply current settings once on mount, then subscribe to live changes
  // broadcast from the Settings window and re-apply them to the editor DOM.
  useEffect(() => {
    applySettingsToDom(useAppStore.getState().settings);
    const unlistenPromise = onSettingsChanged((p) => {
      useAppStore.getState().applySettings(p);
      applySettingsToDom(useAppStore.getState().settings);
    });
    return () => {
      void unlistenPromise.then((unlisten) => unlisten());
    };
  }, []);

  async function handleOpenFolder() {
    const folder = await pickFolder();
    if (!folder) return;
    const dirTree = await readDirTree(folder);
    useAppStore.getState().setWorkspace(folder, dirTree);
    // Detach any prior watcher before starting a new one to avoid leaking listeners.
    unwatchRef.current?.();
    unwatchRef.current = await startWatching(folder);
  }

  async function handleOpen(path: string) {
    const md = await readFile(path);
    useAppStore.getState().openDoc(path, md);
  }

  // Open a single file via the OS picker. We also set the workspace to the file's
  // PARENT directory so the sidebar populates and the file is highlighted/auto-
  // expanded. If the parent can't be read (e.g. permissions), fall back to opening
  // the file standalone so the editor still works.
  async function handleOpenFile() {
    const file = await pickFile();
    if (!file) return;
    const md = await readFile(file);
    const parent = file.slice(0, file.lastIndexOf("/"));
    try {
      const tree = await readDirTree(parent);
      useAppStore.getState().setWorkspace(parent, tree);
      useAppStore.getState().openDoc(file, md);
      // Detach any prior watcher before starting a new one to avoid leaking listeners.
      unwatchRef.current?.();
      unwatchRef.current = await startWatching(parent);
    } catch (err) {
      console.warn("Could not open file's folder", err);
      useAppStore.getState().openDoc(file, md);
    }
  }

  // Close the current folder: stop the fs watcher and reset the workspace so the
  // sidebar returns to its empty state and the editor clears.
  function handleCloseFolder() {
    unwatchRef.current?.();
    unwatchRef.current = null;
    useAppStore.getState().closeWorkspace();
  }

  // Read the current theme from the store (not the render closure) so the
  // ⌘⇧L shortcut — bound once in a []-deps effect — always toggles from the
  // live value rather than a stale one.
  function handleToggleTheme() {
    const next = useAppStore.getState().theme === "dark" ? "light" : "dark";
    useAppStore.getState().setTheme(next);
    applyTheme(next);
  }

  // Create a new untitled document in the current folder and open it. If no
  // folder is open yet, prompt for one first (cancelling aborts the flow).
  // The new file is given a unique "Untitled" name so repeated ⌘N never clobbers
  // an existing file. We re-read the dir after creating so the sidebar updates.
  async function handleNew() {
    const content = "# Untitled\n\n";
    let dir = useAppStore.getState().folder;
    if (!dir) {
      const picked = await pickFolder();
      if (!picked) return;
      dir = picked;
      const dirTree = await readDirTree(dir);
      useAppStore.getState().setWorkspace(dir, dirTree);
      // Detach any prior watcher before starting a new one to avoid leaking listeners.
      unwatchRef.current?.();
      unwatchRef.current = await startWatching(dir);
    }
    const existing = useAppStore.getState().files;
    const name = nextUntitledName(existing.map((f) => f.name));
    const newPath = `${dir}/${name}`;
    await createFile(newPath, content);
    const refreshed = await readDirTree(dir);
    useAppStore.getState().setWorkspace(dir, refreshed);
    useAppStore.getState().openDoc(newPath, content);
  }

  // Commands surfaced in the ⌘K palette. Static labels are fine for v1.
  const commands: Command[] = [
    { id: "outline", label: "Toggle outline", hint: "⌘⌥O", run: () => useAppStore.getState().toggleOutline() },
    { id: "theme", label: "Switch theme", hint: "⌘⇧L", run: () => handleToggleTheme() },
    { id: "focus", label: "Toggle focus mode", hint: "⌘⇧F", run: () => useAppStore.getState().toggleFocus() },
    { id: "new", label: "New document", hint: "⌘N", run: () => handleNew() },
    { id: "sidebar", label: "Toggle sidebar", hint: "⌘\\", run: () => useAppStore.getState().toggleSidebar() },
    { id: "open-folder", label: "Open folder", run: () => void handleOpenFolder() },
    { id: "open-file", label: "Open file…", hint: "⌘O", run: () => void handleOpenFile() },
    { id: "close-folder", label: "Close folder", run: () => handleCloseFolder() },
    { id: "settings", label: "Settings…", hint: "⌘,", run: () => void openSettings() },
  ];

  return (
    <AppShell
      dataFocus={focus ? "1" : "0"}
      sidebarOpen={sidebarOpen}
      sidebar={
        <Sidebar
          tree={tree}
          folder={folder}
          activePath={activePath}
          onOpen={handleOpen}
          onOpenFolder={handleOpenFolder}
          onOpenFile={handleOpenFile}
          onCloseFolder={handleCloseFolder}
          onNew={handleNew}
          onToggleTheme={handleToggleTheme}
          isDark={theme === "dark"}
        />
      }
      toolbar={
        <Toolbar
          activeName={activePath ? baseName(activePath) : "Untitled"}
          outlineOpen={outlineOpen}
          focus={focus}
          onToggleSidebar={toggleSidebar}
          onToggleOutline={toggleOutline}
          onToggleFocus={toggleFocus}
        />
      }
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
          <div className="editor-scroll" data-focus={focus ? "1" : "0"}>
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
        <EmptyState onNew={handleNew} />
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
