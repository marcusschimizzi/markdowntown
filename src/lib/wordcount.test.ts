import { describe, it, expect } from 'vitest';
import { wordStats } from './wordcount';

describe('wordStats', () => {
  it('counts words, non-space chars, and reading time', () => {
    const s = wordStats('Hello world, this is markdowntown.');
    expect(s.words).toBe(5);
    expect(s.chars).toBe('Helloworld,thisismarkdowntown.'.length);
    expect(s.readingMinutes).toBe(1); // min 1
  });

  it('reading time is ceil(words/220) with a floor of 1', () => {
    const text = Array.from({ length: 441 }, () => 'w').join(' ');
    expect(wordStats(text).readingMinutes).toBe(2);
  });

  it('handles empty text', () => {
    const s = wordStats('   ');
    expect(s.words).toBe(0);
    expect(s.readingMinutes).toBe(1);
  });
});
