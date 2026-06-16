import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { SettingsApp } from "./SettingsApp";
import { broadcastSettings } from "./settingsBridge";
import { applySettingsToDom } from "./applySettings";
import { useAppStore } from "../state/store";
import { loadPersisted } from "../state/persistIo";
import type { Settings } from "../state/store";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/newsreader/400.css";
import "@fontsource/newsreader/500.css";
import "@fontsource/newsreader/600.css";
import "@fontsource/newsreader/400-italic.css";
import "../theme/tokens.css";

function SettingsRoot() {
  // Seed from the store's default Settings as a pre-load fallback. The settings
  // window is a separate webview that never runs initPersistence, so we load
  // the user's persisted settings on mount and seed the panel from them.
  const [settings, setSettings] = useState<Settings>(() => useAppStore.getState().settings);

  // On mount, load persisted settings so the panel reflects the user's actual
  // saved values rather than store defaults.
  useEffect(() => {
    void loadPersisted().then((p) => {
      setSettings(p.settings);
      applySettingsToDom(p.settings);
    });
  }, []);

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
