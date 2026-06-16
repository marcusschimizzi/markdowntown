import type { Settings, ThemePref, EditorFont, Width } from '../state/store';
import './SettingsApp.css';

interface Props {
  settings: Settings;
  onChange: (partial: Partial<Settings>) => void;
}

const THEMES: { value: ThemePref; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

const FONTS: { value: EditorFont; sample: string; label: string; sampleStyle: React.CSSProperties }[] = [
  { value: 'serif', sample: 'Writing', label: 'Serif · Newsreader', sampleStyle: { fontFamily: "'Newsreader', Georgia, serif", fontWeight: 500 } },
  { value: 'sans', sample: 'Writing', label: 'Sans · System', sampleStyle: { fontFamily: 'system-ui, sans-serif', fontWeight: 600, letterSpacing: '-.02em' } },
  { value: 'mono', sample: 'Writing', label: 'Mono · JetBrains', sampleStyle: { fontFamily: "'JetBrains Mono', monospace", fontWeight: 400 } },
];

const WIDTHS: { value: Width; label: string }[] = [
  { value: 'narrow', label: 'Narrow' },
  { value: 'normal', label: 'Normal' },
  { value: 'wide', label: 'Wide' },
];

const ACCENTS = ['#3B6EDB', '#B45B36', '#1F8A5B', '#7A5AF5', '#5A6068'];

export function SettingsApp({ settings, onChange }: Props) {
  return (
    <div className="settings">
      <h2 className="settings__label">THEME</h2>
      <div className="settings__segmented" role="group" aria-label="Theme">
        {THEMES.map((t) => (
          <button
            key={t.value}
            type="button"
            className={`settings__seg${settings.themePref === t.value ? ' is-active' : ''}`}
            aria-pressed={settings.themePref === t.value}
            onClick={() => onChange({ themePref: t.value })}
          >
            {t.label}
          </button>
        ))}
      </div>

      <h2 className="settings__label">WIDTH</h2>
      <div className="settings__segmented" role="group" aria-label="Width">
        {WIDTHS.map((w) => (
          <button
            key={w.value}
            type="button"
            className={`settings__seg${settings.width === w.value ? ' is-active' : ''}`}
            aria-pressed={settings.width === w.value}
            onClick={() => onChange({ width: w.value })}
          >
            {w.label}
          </button>
        ))}
      </div>

      <h2 className="settings__label">EDITOR FONT</h2>
      <div className="settings__fonts">
        {FONTS.map((f) => (
          <button
            key={f.value}
            type="button"
            className={`settings__font${settings.font === f.value ? ' is-active' : ''}`}
            aria-pressed={settings.font === f.value}
            aria-label={`font ${f.value}`}
            onClick={() => onChange({ font: f.value })}
          >
            <span className="settings__fontSample" style={f.sampleStyle}>{f.sample}</span>
            <span className="settings__fontLabel">{f.label}</span>
          </button>
        ))}
      </div>

      <div className="settings__sizeHeader">
        <h2 className="settings__label settings__label--inline">FONT SIZE</h2>
        <span className="settings__sizeValue">{settings.fontSize}px</span>
      </div>
      <input
        type="range"
        className="settings__range"
        aria-label="Font size"
        min={13}
        max={22}
        step={1}
        value={settings.fontSize}
        onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
      />

      <h2 className="settings__label">ACCENT</h2>
      <div className="settings__accents">
        {ACCENTS.map((hex) => (
          <button
            key={hex}
            type="button"
            className={`settings__swatch${settings.accent === hex ? ' is-active' : ''}`}
            aria-label={`accent ${hex}`}
            style={{ background: hex, boxShadow: settings.accent === hex ? `0 0 0 2px var(--bg), 0 0 0 3.5px ${hex}` : undefined }}
            onClick={() => onChange({ accent: hex })}
          />
        ))}
      </div>
    </div>
  );
}
