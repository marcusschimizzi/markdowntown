export function nextUntitledName(existingNames: string[]): string {
  const set = new Set(existingNames.map((n) => n.toLowerCase()));
  if (!set.has('untitled.md')) return 'Untitled.md';
  for (let i = 2; i < 1000; i++) {
    const candidate = `Untitled ${i}.md`;
    if (!set.has(candidate.toLowerCase())) return candidate;
  }
  return `Untitled ${Date.now()}.md`;
}
