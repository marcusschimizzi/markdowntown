import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Outline } from './Outline';

const items = [
  { level: 1, text: 'Title', pos: 0, index: 0 },
  { level: 2, text: 'Sub', pos: 10, index: 1 },
];

describe('<Outline />', () => {
  it('renders headings and fires onJump with the position', () => {
    const onJump = vi.fn();
    render(<Outline items={items} activeIndex={0} onJump={onJump} />);
    fireEvent.click(screen.getByText('Sub'));
    expect(onJump).toHaveBeenCalledWith(10);
  });

  it('shows the empty hint when there are no headings', () => {
    render(<Outline items={[]} activeIndex={0} onJump={vi.fn()} />);
    expect(screen.getByText(/No headings yet/i)).toBeInTheDocument();
  });
});
