use std::fs;
use std::io;
use std::path::Path;

pub fn fetch_file(url: String, path: &Path) {
    let mut file = fs::File::create(path).unwrap();
    let mut response = reqwest::blocking::get(url).unwrap();
    io::copy(&mut response, &mut file).unwrap();
}

pub fn sketchbook_exists(path: &Path) -> bool {
    path.join("sketchbook.toml").exists()
}

pub fn replace_in_file(path: &Path, from: &str, to: &str) {
    let contents = fs::read_to_string(path);

    if contents.is_err() {
        return;
    }

    let contents = contents.unwrap().replace(&format!("{{{{{from}}}}}"), to);

    fs::write(path, contents).expect("Failed to write to file");
}
