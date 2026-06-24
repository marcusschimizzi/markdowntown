<div align="center">

<img src="src-tauri/icons/128x128.png" width="96" height="96" alt="Markdowntown icon" />

# Markdowntown

**A calm, Typora-style markdown editor for your desktop.**

Write and preview Markdown in a single distraction-free surface — no split panes, no raw-syntax clutter. Markdowntown edits real `.md` files on disk, so your notes stay plain, portable, and yours.

</div>

---

## Screenshot

_Coming soon — drop an image at `docs/screenshot.png` and uncomment the line below._

<!-- ![Markdowntown editing a document](docs/screenshot.png) -->

## Features

- **Live WYSIWYG editing** — Markdown formats as you type (`# `, `**bold**`, `- lists`, links, and more), with the raw `.md` file always the source of truth.
- **Real files, real folders** — open a single file or a whole folder and browse it in a nested file-tree sidebar; external edits are picked up automatically by a filesystem watcher.
- **Focus mode** — dim everything but the line you're writing, with optional typewriter centering, for deep work.
- **Document outline** — jump around long documents by heading.
- **Command palette** — every action a keystroke away (`⌘K`).
- **Word count & reading time** in the footer.
- **Themes & a settings window** — appearance and editor preferences apply live across windows.
- **Native macOS feel** — overlay title bar with the real traffic-light controls; serif prose (Newsreader) with a monospace code face (JetBrains Mono).

## Keyboard shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘K` | Command palette |
| `⌘N` | New document |
| `⌘O` | Open file |
| `⌘⌥O` | Open folder |
| `⌘S` | Save |
| `⌘\` | Toggle sidebar |
| `⌘⇧L` | Toggle outline |
| `⌘⇧F` | Toggle focus mode |
| `⌘,` | Settings |

## Tech stack

- **[Tauri 2](https://tauri.app/)** — lightweight native shell; file I/O and folder watching handled by a thin Rust layer (`std::fs` + [`notify`](https://github.com/notify-rs/notify)).
- **React + TypeScript** on **[Vite](https://vitejs.dev/)**, with **[Zustand](https://github.com/pmndrs/zustand)** for state.
- **[TipTap 3](https://tiptap.dev/)** editor with **`@tiptap/markdown`** for lossless Markdown round-tripping.
- **[Vitest](https://vitest.dev/)** + Testing Library for the test suite.

## Getting started

**Prerequisites:** [Node.js](https://nodejs.org/) (20+, as required by Vite 8), and the [Tauri prerequisites](https://tauri.app/start/prerequisites/) for your platform (Rust toolchain + system webview). Built and tested on macOS.

```bash
# install dependencies
npm install

# run the app in development (hot-reloading native window)
npm run tauri dev

# run the test suite
npm test

# produce a release build
npm run tauri build
```

> The plain `npm run dev` / `npm run build` scripts run the Vite frontend on its own (useful for UI work); the `tauri` commands wrap it in the native shell.

## Project structure

```
src/            React frontend
  components/   app shell, sidebar, file tree, command palette, outline, toolbar, footer
  editor/       TipTap setup, live autoformat, focus mode, outline & width logic
  settings/     standalone settings window
  state/        Zustand store, persistence, save flow
src-tauri/      Rust backend (fs commands, folder watcher, window config)
  icons/        app icon set (+ editable SVG master in icons/source/)
```

## Status

Early days — version `0.1.0`. The core editing experience is in place and covered by tests; expect rough edges and rapid change.

## License

[MIT](LICENSE) © Marcus Schimizzi
