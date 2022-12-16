{
  description = "A basic flake with a shell";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    devshell.url = "github:numtide/devshell";
    rust-overlay.url = "github:oxalica/rust-overlay";
  };

  outputs = { self, nixpkgs, flake-utils, devshell, rust-overlay }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          overlays = [ devshell.overlay (import rust-overlay) ];
        };

        rustVersion = pkgs.rust-bin.stable.latest.minimal;

        rustPlatform = pkgs.makeRustPlatform {
          cargo = rustVersion;
          rustc = rustVersion;
        };

        myRustBuild = rustPlatform.buildRustPackage {
          pname = "p5_commander"; # make this what ever your cargo.toml package.name is
          version = "0.1.0";
          src = ./.; # the folder with the cargo.toml

          cargoLock.lockFile = ./Cargo.lock;
        };
      in
      {
        packages.${myRustBuild.pname} = myRustBuild;

        defaultPackage = myRustBuild;

        devShell = pkgs.devshell.mkShell {
          name = "rust-shell";
          packages = with pkgs; [
            rust-analyzer
            rustup
            zlib
            pkgconfig
            gcc
            openssl
            openssl.dev
          ];

          env = [
            {
              name = "PKG_CONFIG_PATH";
              value = "${pkgs.openssl.dev}/lib/pkgconfig";
            }
          ];
        };
      });
}
