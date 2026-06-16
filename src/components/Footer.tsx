interface Props {
  words: number;
  chars: number;
  readingMinutes: number;
  saved: string;
}

export function Footer({ words, chars, readingMinutes, saved }: Props) {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ color: 'var(--ink2)', fontWeight: 500 }}>{words.toLocaleString()} words</span>
        <span>·</span>
        <span>{chars.toLocaleString()} characters</span>
        <span>·</span>
        <span>~{readingMinutes} min read</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span>{saved}</span>
        <span style={{ opacity: 0.4 }}>·</span>
        <span>Markdown</span>
      </div>
    </>
  );
}
