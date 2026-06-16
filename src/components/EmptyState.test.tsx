import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmptyState } from './EmptyState';

describe('<EmptyState />', () => {
  it('renders the prompt and triggers new document', () => {
    const onNew = vi.fn();
    render(<EmptyState onNew={onNew} />);
    expect(screen.getByText(/Nothing open/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /New Document/i }));
    expect(onNew).toHaveBeenCalled();
  });
});
