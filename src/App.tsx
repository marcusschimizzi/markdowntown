import { useEffect } from "react";
import { AppShell } from "./components/AppShell";
import { Sidebar } from "./components/Sidebar";
import { MarkdownEditor } from "./editor/Editor";
import { useAppStore } from "./state/store";
import { saveActiveDoc } from "./state/save";
import { pickFolder, readDir, readFile } from "./lib/fsBridge";
import { applyTheme } from "./theme/applyTheme";

function App() {
  // Read store values via selectors so the UI re-renders on folder/file/theme changes.
  const files = useAppStore((s) => s.files);
  const activePath = useAppStore((s) => s.activePath);
  const markdown = useAppStore((s) => s.markdown);
  const dirty = useAppStore((s) => s.dirty);
  const theme = useAppStore((s) => s.theme);

  // Global ⌘S / Ctrl+S save shortcut.
  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        void saveActiveDoc();
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
        <>
          <span>{dirty ? "Saving…" : "Saved"}</span>
          <span>Markdown</span>
        </>
      }
    >
      {activePath ? (
        <MarkdownEditor
          key={activePath}
          markdown={markdown}
          onChange={(md) => useAppStore.getState().setMarkdown(md)}
        />
      ) : (
        <div style={{ flex: 1, padding: "48px 32px", color: "var(--muted)" }}>
          Open a file to start editing.
        </div>
      )}
    </AppShell>
  );
}

export default App;
