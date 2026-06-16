import type { ReactNode } from 'react';
import './AppShell.css';

interface Props {
  sidebar: ReactNode;
  toolbar: ReactNode;
  footer: ReactNode;
  children: ReactNode;
  sidebarOpen?: boolean;
}

export function AppShell({ sidebar, toolbar, footer, children, sidebarOpen = true }: Props) {
  return (
    <div className="mdapp">
      {sidebarOpen && (
        <aside className="mdapp__sidebar">
          <TrafficLights />
          {sidebar}
        </aside>
      )}
      <div className="mdapp__main">
        <header className="mdapp__toolbar chromefade">{toolbar}</header>
        <div className="mdapp__content">{children}</div>
        <footer className="mdapp__footer chromefade">{footer}</footer>
      </div>
    </div>
  );
}

export function TrafficLights() {
  return (
    <div className="traffic-lights" data-testid="traffic-lights">
      <span style={{ background: '#FF5F57' }} />
      <span style={{ background: '#FEBC2E' }} />
      <span style={{ background: '#28C840' }} />
    </div>
  );
}
