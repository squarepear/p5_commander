use clap::Subcommand;

#[derive(Subcommand)]
pub enum Commands {
    /// Create a new sketchbook
    New { name: String },
}

pub fn run(command: &Option<Commands>) {
    match command {
        Some(Commands::New { name }) => {
            println!("Hello, {}! Time to create a new sketchbook!", name);
        }
        None => {
            // Print help
        }
    }
}
