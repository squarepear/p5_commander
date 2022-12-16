use p5_commander::{replace_in_file, sketchbook_exists};
use std::fs;
use std::path::Path;

pub fn run(name: &String) {
    let sketchbook = Path::new(".");

    if !sketchbook_exists(sketchbook) {
        return println!("Sketchbook does not exist");
    }

    let sketch_path = sketchbook.join("sketches").join(name);

    create_sketch(sketch_path.as_path(), name);

    println!("Created sketch at {}", sketch_path.display());
}

fn create_sketch(path: &Path, name: &String) {
    fs::create_dir_all(path).expect("Failed to create sketch");
    fs::write(
        path.join(format!("{name}.js")),
        include_str!("../../templates/sketch/sketch.js"),
    )
    .expect("Failed to create sketch.js");
    fs::write(
        path.join("index.html"),
        include_str!("../../templates/sketch/index.html"),
    )
    .expect("Failed to create sketch.html");
    fs::write(
        path.join("style.css"),
        include_str!("../../templates/sketch/style.css"),
    )
    .expect("Failed to create sketch.css");

    replace_in_file(path.join("index.html").as_path(), "name", name);
}
