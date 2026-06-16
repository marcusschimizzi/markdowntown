import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { SettingsApp } from "./SettingsApp";
import { broadcastSettings } from "./settingsBridge";
import { applySettingsToDom } from "./applySettings";
import { useAppStore } from "../state/store";
import type { Settings } from "../state/store";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/newsreader/400.css";
import "@fontsource/newsreader/500.css";
import "@fontsource/newsreader/600.css";
import "@fontsource/newsreader/400-italic.css";
import "../theme/tokens.css";

function SettingsRoot() {
  // Seed from the store's default Settings (persistence/seeding is Task 28).
  const [settings, setSettings] = useState<Settings>(() => useAppStore.getState().settings);

  // Theme the settings window itself with the current settings. Run as an
  // effect (not during render) so it's a post-commit side effect; re-applies
  // whenever the settings change.
  useEffect(() => {
    applySettingsToDom(settings);
  }, [settings]);

  return (
    <SettingsApp
      settings={settings}
      onChange={(p) => {
        const merged = { ...settings, ...p };
        setSettings(merged);
        applySettingsToDom(merged);
        void broadcastSettings(p);
      }}
    />
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SettingsRoot />
  </React.StrictMode>,
);
