use std::fs;
use std::path::Path;

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Entry {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TreeNode {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
    pub children: Vec<TreeNode>,
}

/// Maximum recursion depth before we stop descending (guards against runaway
/// recursion / deeply nested trees). The root counts as depth 0.
const MAX_DEPTH: usize = 12;

/// Directory names we never descend into (noise).
const DENY_DIRS: &[&str] = &["node_modules", "target", "dist"];

fn is_markdown(name: &str) -> bool {
    let lower = name.to_lowercase();
    lower.ends_with(".md") || lower.ends_with(".markdown")
}

/// True if the directory name should be skipped: dotfiles/dirs or a denied name.
fn is_denied_dir(name: &str) -> bool {
    name.starts_with('.') || DENY_DIRS.contains(&name)
}

/// Recursively builds the markdown tree rooted at `path`.
/// Returns `None` when the directory contains no markdown anywhere inside it
/// (so empty/noise-only dirs are pruned) or when it cannot be read.
fn build_tree(path: &Path, depth: usize) -> Option<TreeNode> {
    let name = path
        .file_name()
        .map(|n| n.to_string_lossy().into_owned())
        .unwrap_or_else(|| path.to_string_lossy().into_owned());

    let mut dirs: Vec<TreeNode> = Vec::new();
    let mut files: Vec<TreeNode> = Vec::new();

    // Stop descending past the depth cap: return the dir without deeper children.
    // It still only survives if it (so far) holds markdown, handled by the caller.
    if depth < MAX_DEPTH {
        // Tolerate read errors: skip this subdir's contents rather than failing.
        let entries = match fs::read_dir(path) {
            Ok(rd) => rd,
            Err(_) => return None,
        };

        for entry in entries.flatten() {
            // Skip entries whose type we can't determine; never follow symlinks.
            let file_type = match entry.file_type() {
                Ok(ft) => ft,
                Err(_) => continue,
            };
            if file_type.is_symlink() {
                continue;
            }

            let entry_name = entry.file_name().to_string_lossy().into_owned();

            if file_type.is_dir() {
                if is_denied_dir(&entry_name) {
                    continue;
                }
                // Only include the subdir if it (recursively) holds markdown.
                if let Some(node) = build_tree(&entry.path(), depth + 1) {
                    dirs.push(node);
                }
            } else if file_type.is_file() && is_markdown(&entry_name) && !entry_name.starts_with('.')
            {
                files.push(TreeNode {
                    name: entry_name,
                    path: entry.path().to_string_lossy().into_owned(),
                    is_dir: false,
                    children: Vec::new(),
                });
            }
        }
    }

    // Prune empty dirs: a dir survives only if it has markdown somewhere inside.
    if dirs.is_empty() && files.is_empty() {
        return None;
    }

    dirs.sort_by(|a, b| a.name.to_lowercase().cmp(&b.name.to_lowercase()));
    files.sort_by(|a, b| a.name.to_lowercase().cmp(&b.name.to_lowercase()));

    // Directories first, then files.
    let mut children = dirs;
    children.extend(files);

    Some(TreeNode {
        name,
        path: path.to_string_lossy().into_owned(),
        is_dir: true,
        children,
    })
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
pub fn read_dir_tree(path: String) -> Result<TreeNode, String> {
    let root = Path::new(&path);
    if !root.is_dir() {
        return Err(format!("not a directory: {path}"));
    }
    // The root is always returned even if it holds no markdown (so the caller
    // gets a valid, possibly empty, workspace root).
    Ok(build_tree(root, 0).unwrap_or_else(|| TreeNode {
        name: root
            .file_name()
            .map(|n| n.to_string_lossy().into_owned())
            .unwrap_or_else(|| path.clone()),
        path: root.to_string_lossy().into_owned(),
        is_dir: true,
        children: Vec::new(),
    }))
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

    /// An isolated temp dir unique to this test invocation (so parallel tests
    /// and reruns don't collide).
    fn unique_tmp(tag: &str) -> std::path::PathBuf {
        use std::sync::atomic::{AtomicU64, Ordering};
        static COUNTER: AtomicU64 = AtomicU64::new(0);
        let n = COUNTER.fetch_add(1, Ordering::Relaxed);
        let mut p = env::temp_dir();
        p.push(format!("mdt_tree_{}_{}_{}", std::process::id(), tag, n));
        let _ = std::fs::remove_dir_all(&p);
        std::fs::create_dir_all(&p).unwrap();
        p
    }

    #[test]
    fn read_dir_tree_prunes_noise_and_orders_dirs_first() {
        let dir = unique_tmp("walk");

        // Top-level markdown file.
        std::fs::write(dir.join("a.md"), "# a").unwrap();

        // Subdir with markdown inside (should be kept).
        std::fs::create_dir_all(dir.join("sub")).unwrap();
        std::fs::write(dir.join("sub").join("b.md"), "# b").unwrap();

        // Noise dir with junk (should be excluded entirely).
        std::fs::create_dir_all(dir.join("node_modules")).unwrap();
        std::fs::write(dir.join("node_modules").join("junk.md"), "junk").unwrap();
        std::fs::write(dir.join("node_modules").join("index.js"), "x").unwrap();

        // Empty dir / dir with no markdown (should be excluded).
        std::fs::create_dir_all(dir.join("empty")).unwrap();

        let tree = read_dir_tree(dir.to_string_lossy().into()).unwrap();

        assert!(tree.is_dir);
        let names: Vec<&str> = tree.children.iter().map(|c| c.name.as_str()).collect();

        // Includes a.md and the sub dir.
        assert!(names.contains(&"a.md"), "expected a.md, got {names:?}");
        assert!(names.contains(&"sub"), "expected sub, got {names:?}");

        // Excludes noise and empty dirs.
        assert!(!names.contains(&"node_modules"), "node_modules not pruned: {names:?}");
        assert!(!names.contains(&"empty"), "empty dir not pruned: {names:?}");

        // sub contains b.md.
        let sub = tree.children.iter().find(|c| c.name == "sub").unwrap();
        assert!(sub.is_dir);
        assert!(sub.children.iter().any(|c| c.name == "b.md" && !c.is_dir));

        // Directories first, then files: "sub" (dir) before "a.md" (file).
        let sub_idx = names.iter().position(|n| *n == "sub").unwrap();
        let a_idx = names.iter().position(|n| *n == "a.md").unwrap();
        assert!(sub_idx < a_idx, "dirs should come before files: {names:?}");

        let _ = std::fs::remove_dir_all(&dir);
    }

    #[test]
    fn read_dir_tree_skips_dotfiles_and_dotdirs() {
        let dir = unique_tmp("dot");
        std::fs::write(dir.join("keep.md"), "# k").unwrap();
        std::fs::write(dir.join(".hidden.md"), "# h").unwrap();
        std::fs::create_dir_all(dir.join(".git")).unwrap();
        std::fs::write(dir.join(".git").join("config.md"), "x").unwrap();

        let tree = read_dir_tree(dir.to_string_lossy().into()).unwrap();
        let names: Vec<&str> = tree.children.iter().map(|c| c.name.as_str()).collect();

        assert!(names.contains(&"keep.md"));
        assert!(!names.contains(&".hidden.md"), "dotfile not pruned: {names:?}");
        assert!(!names.contains(&".git"), "dotdir not pruned: {names:?}");

        let _ = std::fs::remove_dir_all(&dir);
    }
}
