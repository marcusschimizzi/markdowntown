import { AppShell } from "./components/AppShell";
import { Sidebar } from "./components/Sidebar";
import { useAppStore } from "./state/store";
import { pickFolder, readDir, readFile } from "./lib/fsBridge";
import { applyTheme } from "./theme/applyTheme";

function App() {
  // Read store values via selectors so the UI re-renders on folder/file/theme changes.
  const files = useAppStore((s) => s.files);
  const activePath = useAppStore((s) => s.activePath);
  const theme = useAppStore((s) => s.theme);

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
          <span>0 words</span>
          <span>Markdown</span>
        </>
      }
    >
      <div style={{ flex: 1, padding: "48px 32px", color: "var(--muted)" }}>
        Editor
      </div>
    </AppShell>
  );
}

export default App;
