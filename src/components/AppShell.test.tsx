import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppShell } from './AppShell';

describe('<AppShell />', () => {
  it('renders the three traffic-light dots, toolbar, sidebar and footer regions', () => {
    render(
      <AppShell
        sidebar={<div>SIDEBAR</div>}
        toolbar={<div>TOOLBAR</div>}
        footer={<div>FOOTER</div>}
      >
        <div>EDITOR</div>
      </AppShell>
    );
    expect(screen.getByTestId('traffic-lights').children).toHaveLength(3);
    expect(screen.getByText('SIDEBAR')).toBeInTheDocument();
    expect(screen.getByText('TOOLBAR')).toBeInTheDocument();
    expect(screen.getByText('EDITOR')).toBeInTheDocument();
    expect(screen.getByText('FOOTER')).toBeInTheDocument();
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
