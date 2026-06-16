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
    render(<Sidebar tree={tree} folder="/x" activePath="/x/a.md" onOpen={onOpen}
      onOpenFolder={vi.fn()} onOpenFile={vi.fn()} onCloseFolder={vi.fn()}
      onNew={vi.fn()} onToggleTheme={vi.fn()} isDark={false} />);
    expect(screen.getByText('a')).toBeInTheDocument();
    expect(screen.getByText('b')).toBeInTheDocument();
    fireEvent.click(screen.getByText('b'));
    expect(onOpen).toHaveBeenCalledWith('/x/b.md');
  });

  it('shows an open-folder affordance when the tree is null', () => {
    const onOpenFolder = vi.fn();
    render(<Sidebar tree={null} folder={null} activePath={null} onOpen={vi.fn()}
      onOpenFolder={onOpenFolder} onOpenFile={vi.fn()} onCloseFolder={vi.fn()}
      onNew={vi.fn()} onToggleTheme={vi.fn()} isDark={false} />);
    fireEvent.click(screen.getByText(/open folder/i));
    expect(onOpenFolder).toHaveBeenCalled();
  });

  it('fires onCloseFolder and onOpenFile from the header controls when a folder is open', () => {
    const onCloseFolder = vi.fn();
    const onOpenFile = vi.fn();
    render(<Sidebar tree={tree} folder="/x" activePath="/x/a.md" onOpen={vi.fn()}
      onOpenFolder={vi.fn()} onOpenFile={onOpenFile} onCloseFolder={onCloseFolder}
      onNew={vi.fn()} onToggleTheme={vi.fn()} isDark={false} />);
    fireEvent.click(screen.getByLabelText('Close folder'));
    expect(onCloseFolder).toHaveBeenCalled();
    fireEvent.click(screen.getByLabelText('Open file'));
    expect(onOpenFile).toHaveBeenCalled();
  });
});
