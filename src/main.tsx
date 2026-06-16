import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { initPersistence } from "./state/persistIo";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/newsreader/400.css";
import "@fontsource/newsreader/500.css";
import "@fontsource/newsreader/600.css";
import "@fontsource/newsreader/400-italic.css";
import "./theme/tokens.css";

// Restore persisted settings/layout and start debounced autosave.
initPersistence();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
