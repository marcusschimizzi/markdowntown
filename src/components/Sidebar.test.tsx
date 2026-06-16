import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from './Sidebar';

const files = [
  { name: 'a.md', path: '/x/a.md', isDir: false },
  { name: 'b.md', path: '/x/b.md', isDir: false },
];

describe('<Sidebar />', () => {
  it('lists markdown files and fires onOpen with the clicked path', () => {
    const onOpen = vi.fn();
    render(<Sidebar files={files} activePath="/x/a.md" onOpen={onOpen}
      onOpenFolder={vi.fn()} onNew={vi.fn()} onToggleTheme={vi.fn()} isDark={false} />);
    expect(screen.getByText('a')).toBeInTheDocument();
    expect(screen.getByText('b')).toBeInTheDocument();
    fireEvent.click(screen.getByText('b'));
    expect(onOpen).toHaveBeenCalledWith('/x/b.md');
  });

  it('shows an open-folder affordance when there are no files', () => {
    const onOpenFolder = vi.fn();
    render(<Sidebar files={[]} activePath={null} onOpen={vi.fn()}
      onOpenFolder={onOpenFolder} onNew={vi.fn()} onToggleTheme={vi.fn()} isDark={false} />);
    fireEvent.click(screen.getByText(/open folder/i));
    expect(onOpenFolder).toHaveBeenCalled();
  });
});
