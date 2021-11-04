{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
	name = "deno-dev-shell";

	nativeBuildInputs = with pkgs; [
		deno
	];
}