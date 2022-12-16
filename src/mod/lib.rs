pub fn fetch_file(url: String, path: Path) {
    let mut file = File::create(path).unwrap();
    let mut response = reqwest::get(url).unwrap();
    io::copy(&mut response, &mut file).unwrap();
}
