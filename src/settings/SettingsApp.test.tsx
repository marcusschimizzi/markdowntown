import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsApp } from './SettingsApp';

describe('<SettingsApp />', () => {
  it('emits a settings change when an accent swatch is chosen', () => {
    const onChange = vi.fn();
    render(<SettingsApp settings={{ themePref: 'light', font: 'sans', fontSize: 17, accent: '#3B6EDB', width: 'normal' }} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText('accent #B45B36'));
    expect(onChange).toHaveBeenCalledWith({ accent: '#B45B36' });
  });

  it('emits a theme change', () => {
    const onChange = vi.fn();
    render(<SettingsApp settings={{ themePref: 'light', font: 'sans', fontSize: 17, accent: '#3B6EDB', width: 'normal' }} onChange={onChange} />);
    fireEvent.click(screen.getByText('Dark'));
    expect(onChange).toHaveBeenCalledWith({ themePref: 'dark' });
  });
});
