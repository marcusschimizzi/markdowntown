import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from './Sidebar';
import type { TreeNode } from '../lib/types';

const tree: TreeNode = {
  name: 'x',
  path: '/x',
  isDir: true,
  children: [
    { name: 'a.md', path: '/x/a.md', isDir: false, children: [] },
    { name: 'b.md', path: '/x/b.md', isDir: false, children: [] },
  ],
};

describe('<Sidebar />', () => {
  it('renders the file tree and fires onOpen with the clicked path', () => {
    const onOpen = vi.fn();
    render(<Sidebar tree={tree} activePath="/x/a.md" onOpen={onOpen}
      onOpenFolder={vi.fn()} onNew={vi.fn()} onToggleTheme={vi.fn()} isDark={false} />);
    expect(screen.getByText('a')).toBeInTheDocument();
    expect(screen.getByText('b')).toBeInTheDocument();
    fireEvent.click(screen.getByText('b'));
    expect(onOpen).toHaveBeenCalledWith('/x/b.md');
  });

  it('shows an open-folder affordance when the tree is null', () => {
    const onOpenFolder = vi.fn();
    render(<Sidebar tree={null} activePath={null} onOpen={vi.fn()}
      onOpenFolder={onOpenFolder} onNew={vi.fn()} onToggleTheme={vi.fn()} isDark={false} />);
    fireEvent.click(screen.getByText(/open folder/i));
    expect(onOpenFolder).toHaveBeenCalled();
  });
});
