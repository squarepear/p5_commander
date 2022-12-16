pub mod new;

use clap::Subcommand;

#[derive(Subcommand)]
pub enum Commands {
    /// Create a new sketchbook
    New {
        #[arg(default_value = "sketch")]
        name: String,
    },
}

pub fn run(command: &Option<Commands>) {
    match command {
        Some(Commands::New { name }) => new::run(name),
        None => {
            // Print help
        }
    }
}
