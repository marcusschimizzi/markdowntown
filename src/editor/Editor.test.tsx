import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MarkdownEditor } from './Editor';

describe('<MarkdownEditor />', () => {
  it('renders the markdown content as a textbox', async () => {
    render(<MarkdownEditor markdown={'# Hello'} onChange={() => {}} />);
    const surface = await screen.findByRole('textbox');
    expect(surface).toHaveTextContent('Hello');
  });
});
