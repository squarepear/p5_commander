pub fn run(dev: &bool) {
    if *dev {
        println!("Running in dev mode");
    } else {
        println!("Running in prod mode");
    }
}
