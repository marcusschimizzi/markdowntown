export interface WordStats {
  words: number;
  chars: number;
  readingMinutes: number;
}

export function wordStats(text: string): WordStats {
  const words = (text.trim().match(/[^\s]+/g) ?? []).length;
  const chars = text.replace(/\s/g, '').length;
  const readingMinutes = Math.max(1, Math.round(words / 220) || 1);
  return { words, chars, readingMinutes };
}
