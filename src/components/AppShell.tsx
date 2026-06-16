import type { ReactNode } from 'react';
import './AppShell.css';

interface Props {
  sidebar: ReactNode;
  toolbar: ReactNode;
  footer: ReactNode;
  children: ReactNode;
  sidebarOpen?: boolean;
  dataFocus?: string;
}

export function AppShell({ sidebar, toolbar, footer, children, sidebarOpen = true, dataFocus = '0' }: Props) {
  return (
    <div className="mdapp" data-focus={dataFocus}>
      {sidebarOpen && (
        <aside className="mdapp__sidebar">
          <div className="mdapp__titlebar" data-tauri-drag-region />
          {sidebar}
        </aside>
      )}
      <div className="mdapp__main">
        <header
          className={`mdapp__toolbar chromefade${sidebarOpen ? '' : ' mdapp__toolbar--inset'}`}
          data-tauri-drag-region
        >
          {toolbar}
        </header>
        <div className="mdapp__content">{children}</div>
        <footer className="mdapp__footer chromefade">{footer}</footer>
      </div>
    </div>
  );
}
