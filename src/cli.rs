pub mod book;
pub mod serve;
pub mod sketch;

use clap::{Parser, Subcommand};

/// Simple program to greet a person
#[derive(Parser)]
#[command(author, version, about, long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Option<Commands>,
}

#[derive(Subcommand)]
enum Commands {
    /// Manage your sketchbook
    Book {
        #[command(subcommand)]
        command: Option<book::Commands>,
    },

    /// Manage your sketches
    Sketch {
        #[command(subcommand)]
        command: Option<sketch::Commands>,
    },

    /// Serve the sketchbook
    Serve {
        /// Run in development mode (with hot reloading)
        #[arg(short, long)]
        dev: bool,
    },
}

pub fn run() {
    let cli = Cli::parse();

    match &cli.command {
        Some(Commands::Book { command }) => book::run(command),
        Some(Commands::Sketch { command }) => sketch::run(command),
        Some(Commands::Serve { dev }) => serve::run(dev),
        None => println!("No command provided"),
    }
}

#[test]
fn verify_cli() {
    use clap::CommandFactory;
    Cli::command().debug_assert()
}
