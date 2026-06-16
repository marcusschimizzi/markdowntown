import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Toolbar } from './Toolbar';

describe('<Toolbar />', () => {
  it('shows the active filename and fires the toggle callbacks', () => {
    const onSidebar = vi.fn(), onOutline = vi.fn(), onFocus = vi.fn();
    render(<Toolbar activeName="On Writing Plainly" outlineOpen focus={false}
      onToggleSidebar={onSidebar} onToggleOutline={onOutline} onToggleFocus={onFocus} />);
    expect(screen.getByText('On Writing Plainly.md')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText(/toggle sidebar/i));
    fireEvent.click(screen.getByLabelText(/toggle outline/i));
    fireEvent.click(screen.getByLabelText(/focus mode/i));
    expect(onSidebar).toHaveBeenCalled();
    expect(onOutline).toHaveBeenCalled();
    expect(onFocus).toHaveBeenCalled();
  });
});
