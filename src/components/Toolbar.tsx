interface Props {
  activeName: string;
  outlineOpen: boolean;
  focus: boolean;
  onToggleSidebar: () => void;
  onToggleOutline: () => void;
  onToggleFocus: () => void;
}

const iconButton: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  background: 'transparent',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  color: 'inherit',
};

export function Toolbar({
  activeName,
  outlineOpen,
  focus,
  onToggleSidebar,
  onToggleOutline,
  onToggleFocus,
}: Props) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      <button
        type="button"
        aria-label="Toggle sidebar"
        onClick={onToggleSidebar}
        style={iconButton}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <rect x="3" y="4.5" width="18" height="15" rx="2.6" />
          <path d="M9 4.5v15" />
        </svg>
      </button>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <span style={{ font: '530 13px/1 system-ui', color: 'var(--ink2)' }}>{activeName}.md</span>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--faint)' }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          type="button"
          aria-label="Toggle outline"
          onClick={onToggleOutline}
          style={{ ...iconButton, color: outlineOpen ? 'var(--accent)' : 'var(--muted)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M4 6h16M4 12h16M4 18h10" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Focus mode"
          onClick={onToggleFocus}
          style={{ ...iconButton, color: focus ? 'var(--accent)' : 'var(--muted)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <circle cx="12" cy="12" r="3.4" />
            <circle cx="12" cy="12" r="8.4" />
          </svg>
        </button>
      </div>
    </div>
  );
}
