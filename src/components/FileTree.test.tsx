import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FileTree } from './FileTree';
import type { TreeNode } from '../lib/types';

const fileA: TreeNode = { name: 'fileA.md', path: '/ws/fileA.md', isDir: false, children: [] };
const fileB: TreeNode = { name: 'fileB.md', path: '/ws/sub/fileB.md', isDir: false, children: [] };
const sub: TreeNode = { name: 'sub', path: '/ws/sub', isDir: true, children: [fileB] };
const root: TreeNode = { name: 'ws', path: '/ws', isDir: true, children: [fileA, sub] };

describe('<FileTree />', () => {
  it('renders top-level files (by basename) and directories', () => {
    render(<FileTree root={root} activePath={null} onOpen={vi.fn()} />);
    expect(screen.getByText('fileA')).toBeInTheDocument();
    expect(screen.getByText('sub')).toBeInTheDocument();
  });

  it('keeps nested files collapsed until their directory is expanded', () => {
    render(<FileTree root={root} activePath={null} onOpen={vi.fn()} />);
    expect(screen.queryByText('fileB')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('sub'));
    expect(screen.getByText('fileB')).toBeInTheDocument();
  });

  it('fires onOpen with the path when a top-level file is clicked', () => {
    const onOpen = vi.fn();
    render(<FileTree root={root} activePath={null} onOpen={onOpen} />);
    fireEvent.click(screen.getByText('fileA'));
    expect(onOpen).toHaveBeenCalledWith('/ws/fileA.md');
  });

  it('fires onOpen with the path when a nested file is clicked after expanding', () => {
    const onOpen = vi.fn();
    render(<FileTree root={root} activePath={null} onOpen={onOpen} />);
    fireEvent.click(screen.getByText('sub'));
    fireEvent.click(screen.getByText('fileB'));
    expect(onOpen).toHaveBeenCalledWith('/ws/sub/fileB.md');
  });

  it('auto-expands a directory that contains the active path', () => {
    render(<FileTree root={root} activePath="/ws/sub/fileB.md" onOpen={vi.fn()} />);
    expect(screen.getByText('fileB')).toBeInTheDocument();
  });

  it('renders nothing meaningful for a null root', () => {
    const { container } = render(<FileTree root={null} activePath={null} onOpen={vi.fn()} />);
    expect(container.querySelector('.sidebar__row')).toBeNull();
  });
});
