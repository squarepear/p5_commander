// Utility functions

import { exists, join } from "../deps.ts";

// Check if a directory is a p5_commander Collection
export async function isCollection(path: string): Promise<boolean> {
  return await exists(path) && await exists(join(path, "libraries")) &&
    await exists(join(path, "sketches"));
}

// Download a file from a url and write it to destination
export async function download(source: string, destination: string) {
  const response = await fetch(source);
  const blob = await response.blob();

  const buf = await blob.arrayBuffer();
  const data = new Uint8Array(buf);

  const file = await Deno.create(destination);

  await Deno.writeAll(file, data);

  Deno.close(file.rid);
}
