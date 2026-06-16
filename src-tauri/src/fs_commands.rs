use std::fs;

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Entry {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
}

#[tauri::command]
pub fn read_file(path: String) -> Result<String, String> {
    fs::read_to_string(&path).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn write_file(path: String, contents: String) -> Result<(), String> {
    fs::write(&path, contents).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn create_file(path: String, contents: String) -> Result<(), String> {
    if std::path::Path::new(&path).exists() {
        return Err("file already exists".into());
    }
    fs::write(&path, contents).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn create_dir(path: String) -> Result<(), String> {
    fs::create_dir_all(&path).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn read_dir(path: String) -> Result<Vec<Entry>, String> {
    let mut out = Vec::new();
    for e in fs::read_dir(&path).map_err(|e| e.to_string())? {
        let e = e.map_err(|e| e.to_string())?;
        let md = e.metadata().map_err(|e| e.to_string())?;
        out.push(Entry {
            name: e.file_name().to_string_lossy().into_owned(),
            path: e.path().to_string_lossy().into_owned(),
            is_dir: md.is_dir(),
        });
    }
    out.sort_by(|a, b| a.name.to_lowercase().cmp(&b.name.to_lowercase()));
    Ok(out)
}

#[tauri::command]
pub fn rename_path(from: String, to: String) -> Result<(), String> {
    fs::rename(&from, &to).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delete_path(path: String) -> Result<(), String> {
    fs::remove_file(&path).map_err(|e| e.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::env;

    fn tmp() -> std::path::PathBuf {
        let mut p = env::temp_dir();
        p.push(format!("mdt_test_{}", std::process::id()));
        let _ = std::fs::create_dir_all(&p);
        p
    }

    #[test]
    fn write_then_read_roundtrips() {
        let dir = tmp();
        let f = dir.join("a.md");
        write_file(f.to_string_lossy().into(), "# hi".into()).unwrap();
        assert_eq!(read_file(f.to_string_lossy().into()).unwrap(), "# hi");
    }

    #[test]
    fn read_dir_lists_entries() {
        let dir = tmp();
        std::fs::write(dir.join("b.md"), "x").unwrap();
        let entries = read_dir(dir.to_string_lossy().into()).unwrap();
        assert!(entries.iter().any(|e| e.name == "b.md" && !e.is_dir));
    }
}
