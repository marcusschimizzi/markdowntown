import type { OutlineItem } from '../editor/outline';
import './Outline.css';

interface Props {
  items: OutlineItem[];
  activeIndex: number;
  onJump: (pos: number) => void;
}

export function Outline({ items, activeIndex, onJump }: Props) {
  return (
    <div className="outline">
      <div className="outline__title">OUTLINE</div>
      <div className="outline__list">
        {items.length === 0 && (
          <div className="outline__empty">
            No headings yet. Type <code># </code> to add one.
          </div>
        )}
        {items.map((h) => (
          <div
            key={h.index}
            className={`outline__row${h.index === activeIndex ? ' is-active' : ''}`}
            style={{ paddingLeft: h.level === 1 ? 8 : h.level === 2 ? 20 : 30 }}
            onClick={() => onJump(h.pos)}
          >
            {h.text}
          </div>
        ))}
      </div>
    </div>
  );
}
