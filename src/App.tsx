import { AppShell } from "./components/AppShell";

function App() {
  return (
    <AppShell
      sidebar={<div style={{ padding: "12px 16px", color: "var(--faint)" }}>Documents</div>}
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
