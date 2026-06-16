use std::path::Path;
use std::sync::Mutex;
use std::time::Duration;

use notify_debouncer_full::notify::{RecommendedWatcher, RecursiveMode};
use notify_debouncer_full::{new_debouncer, DebounceEventResult, Debouncer, RecommendedCache};
use serde::Serialize;
use tauri::{AppHandle, Emitter};

pub struct WatcherState(pub Mutex<Option<Debouncer<RecommendedWatcher, RecommendedCache>>>);

impl Default for WatcherState {
    fn default() -> Self {
        WatcherState(Mutex::new(None))
    }
}

#[derive(Clone, Serialize)]
struct FsChange {
    paths: Vec<String>,
    kind: String,
}

#[tauri::command]
pub fn watch_dir(
    app: AppHandle,
    state: tauri::State<'_, WatcherState>,
    path: String,
) -> Result<(), String> {
    let handle = app.clone();
    let mut debouncer = new_debouncer(
        Duration::from_millis(400),
        None,
        move |res: DebounceEventResult| {
            if let Ok(events) = res {
                for ev in events {
                    let payload = FsChange {
                        paths: ev.paths.iter().map(|p| p.display().to_string()).collect(),
                        kind: format!("{:?}", ev.kind),
                    };
                    let _ = handle.emit("fs-change", payload);
                }
            }
        },
    )
    .map_err(|e| e.to_string())?;

    debouncer
        .watch(Path::new(&path), RecursiveMode::NonRecursive)
        .map_err(|e| e.to_string())?;
    *state.0.lock().unwrap() = Some(debouncer); // keep alive; replaces previous
    Ok(())
}
