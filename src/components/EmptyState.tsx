interface Props {
  onNew: () => void;
}

export function EmptyState({ onNew }: Props) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
      }}
    >
      <div
        style={{
          font: "600 21px/1.3 system-ui",
          letterSpacing: "-.018em",
          color: "var(--ink2)",
          margin: "24px 0 8px",
        }}
      >
        Nothing open
      </div>
      <div
        style={{
          font: "400 15px/1.6 system-ui",
          color: "var(--muted)",
          textAlign: "center",
          maxWidth: 300,
          marginBottom: 24,
        }}
      >
        Choose a file from the sidebar, or start something new. Markdown only —
        nothing else to learn.
      </div>
      <button
        onClick={onNew}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          height: 38,
          padding: "0 18px",
          background: "var(--accent)",
          border: "none",
          borderRadius: 9,
          color: "#fff",
          font: "560 14px/1 system-ui",
          cursor: "pointer",
        }}
      >
        + New Document <span style={{ opacity: 0.7, marginLeft: 2 }}>⌘N</span>
      </button>
    </div>
  );
}
