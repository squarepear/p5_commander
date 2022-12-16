pub mod new;

use clap::Subcommand;

#[derive(Subcommand)]
pub enum Commands {
    /// Create a new sketchbook
    New {
        #[arg(default_value = "sketchbook")]
        name: String,
        #[arg(default_value = ".")]
        path: String,
    },
}

pub fn run(command: &Option<Commands>) {
    match command {
        Some(Commands::New { name, path }) => new::run(name, path),
        None => {
            // Print help
        }
    }
}
