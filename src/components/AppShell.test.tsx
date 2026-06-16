import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppShell } from './AppShell';

describe('<AppShell />', () => {
  it('renders the toolbar, sidebar, editor and footer regions with a drag-region titlebar', () => {
    const { container } = render(
      <AppShell
        sidebar={<div>SIDEBAR</div>}
        toolbar={<div>TOOLBAR</div>}
        footer={<div>FOOTER</div>}
      >
        <div>EDITOR</div>
      </AppShell>
    );
    // The fake traffic lights are gone; the native macOS controls overlay the chrome.
    expect(screen.queryByTestId('traffic-lights')).not.toBeInTheDocument();
    // A drag-region spacer reserves space at the top of the sidebar for the native lights.
    expect(container.querySelector('.mdapp__titlebar')).toHaveAttribute('data-tauri-drag-region');
    // The toolbar is also a drag region.
    expect(container.querySelector('.mdapp__toolbar')).toHaveAttribute('data-tauri-drag-region');
    expect(screen.getByText('SIDEBAR')).toBeInTheDocument();
    expect(screen.getByText('TOOLBAR')).toBeInTheDocument();
    expect(screen.getByText('EDITOR')).toBeInTheDocument();
    expect(screen.getByText('FOOTER')).toBeInTheDocument();
  });

  it('insets the toolbar to clear the native traffic lights when the sidebar is hidden', () => {
    const { container } = render(
      <AppShell
        sidebar={<div>SIDEBAR</div>}
        toolbar={<div>TOOLBAR</div>}
        footer={<div>FOOTER</div>}
        sidebarOpen={false}
      >
        <div>EDITOR</div>
      </AppShell>
    );
    expect(container.querySelector('.mdapp__toolbar')).toHaveClass('mdapp__toolbar--inset');
    // No sidebar means no titlebar spacer either.
    expect(container.querySelector('.mdapp__titlebar')).not.toBeInTheDocument();
  });

  it('forwards dataFocus onto the .mdapp root element', () => {
    const { container } = render(
      <AppShell
        sidebar={<div>SIDEBAR</div>}
        toolbar={<div>TOOLBAR</div>}
        footer={<div>FOOTER</div>}
        dataFocus="1"
      >
        <div>EDITOR</div>
      </AppShell>
    );
    expect(container.querySelector('.mdapp')).toHaveAttribute('data-focus', '1');
  });
});
