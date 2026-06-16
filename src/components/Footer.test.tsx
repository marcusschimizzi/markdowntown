import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

describe('<Footer />', () => {
  it('shows words, characters, reading time and save state', () => {
    render(<Footer words={642} chars={3810} readingMinutes={3} saved="Saved" />);
    expect(screen.getByText(/642 words/)).toBeInTheDocument();
    expect(screen.getByText(/3,810 characters/)).toBeInTheDocument();
    expect(screen.getByText(/~3 min read/)).toBeInTheDocument();
    expect(screen.getByText('Saved')).toBeInTheDocument();
  });
});
