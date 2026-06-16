mod fs_commands;
mod watcher;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .manage(watcher::WatcherState::default())
        .invoke_handler(tauri::generate_handler![
            fs_commands::read_file,
            fs_commands::write_file,
            fs_commands::create_file,
            fs_commands::create_dir,
            fs_commands::read_dir,
            fs_commands::read_dir_tree,
            fs_commands::rename_path,
            fs_commands::delete_path,
            watcher::watch_dir,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
