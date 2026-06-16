/** Subsequence match returning a score (lower = better), or null if no match. */
export function fuzzyScore(query: string, target: string): number | null {
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  if (q === '') return 0;
  let ti = 0;
  let score = 0;
  let prevMatch = -1;
  for (const ch of q) {
    const found = t.indexOf(ch, ti);
    if (found === -1) return null;
    if (prevMatch !== -1) score += found - prevMatch; // gaps cost
    prevMatch = found;
    ti = found + 1;
  }
  return score;
}

export function fuzzyFilter<T>(items: T[], query: string, key: (t: T) => string): T[] {
  if (query.trim() === '') return items;
  return items
    .map((item) => ({ item, score: fuzzyScore(query, key(item)) }))
    .filter((r): r is { item: T; score: number } => r.score !== null)
    .sort((a, b) => a.score - b.score)
    .map((r) => r.item);
}
