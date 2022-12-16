use p5_commander::{fetch_file, replace_in_file, sketchbook_exists};
use std::fs;
use std::path::Path;

pub fn run(name: &String, path: &String) {
    let sketchbook = Path::new(path).join(name);

    if sketchbook_exists(sketchbook.as_path()) {
        return println!("Sketchbook already exists");
    }

    create_sketchbook(sketchbook.as_path());
    fetch_p5js(sketchbook.as_path());
    create_config(sketchbook.as_path());

    println!("Created sketchbook at {}", sketchbook.display());
}

fn create_sketchbook(path: &Path) {
    fs::create_dir_all(path).expect("Failed to create sketchbook");
    fs::create_dir_all(path.join("sketches")).expect("Failed to create sketches directory");
    fs::create_dir_all(path.join("assets")).expect("Failed to create assets directory");
}

fn fetch_p5js(path: &Path) {
    let p5js_library_path = path.join("libraries").join("p5");

    fs::create_dir_all(p5js_library_path.clone())
        .expect("Failed to create p5.js library directory");

    let p5js_release_text = reqwest::blocking::Client::new()
        .get("https://api.github.com/repos/processing/p5.js/releases/latest")
        .header("User-Agent", "p5_commander")
        .send()
        .expect("Failed to fetch p5.js release")
        .text()
        .expect("Failed to read p5.js release");

    let p5js_release: serde_json::Value =
        serde_json::from_str(&p5js_release_text).expect("Failed to parse p5.js release");

    let p5js_release_tag = p5js_release["tag_name"].as_str().unwrap();

    let p5js_url: String = format!(
        "https://github.com/processing/p5.js/releases/download/{p5js_release_tag}/p5.min.js"
    );

    fetch_file(p5js_url, &p5js_library_path.join("p5.js"));
}

fn create_config(path: &Path) {
    fs::write(
        path.join("sketchbook.toml"),
        include_str!("../../templates/sketchbook.toml"),
    )
    .expect("Failed to create sketchbook.toml");

    replace_in_file(
        &path.join("sketchbook.toml"),
        "name",
        path.file_name().unwrap().to_str().unwrap(),
    );
}
