use clap::Subcommand;

#[derive(Subcommand)]
pub enum Commands {
    /// Create a new sketch
    New { name: String },
}

pub fn run(command: &Option<Commands>) {
    match command {
        Some(Commands::New { name }) => {
            println!("Hello, {}! Time to create a new sketch!", name);
        }
        None => {
            // Print help
        }
    }
}
