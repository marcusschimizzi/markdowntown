import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CommandPalette } from './CommandPalette';

const files = [{ name: 'a.md', path: '/x/a.md', isDir: false }];
const commands = [
  { id: 'theme', label: 'Switch to dark theme', hint: '⌘⇧L', run: vi.fn() },
];

describe('<CommandPalette />', () => {
  it('filters and runs a file on Enter', () => {
    const onOpenFile = vi.fn();
    render(<CommandPalette files={files} commands={commands}
      onOpenFile={onOpenFile} onClose={vi.fn()} />);
    const input = screen.getByPlaceholderText(/Go to a file/i);
    fireEvent.change(input, { target: { value: 'a' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onOpenFile).toHaveBeenCalledWith('/x/a.md');
  });

  it('closes on Escape', () => {
    const onClose = vi.fn();
    render(<CommandPalette files={files} commands={commands}
      onOpenFile={vi.fn()} onClose={onClose} />);
    fireEvent.keyDown(screen.getByPlaceholderText(/Go to a file/i), { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});
