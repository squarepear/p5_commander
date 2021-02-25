// Utility functions

import { exists, join } from "../deps.ts";

export async function isCollection(path: string): Promise<boolean> {
  return await exists(path) && await exists(join(path, "libraries")) &&
    await exists(join(path, "sketches"));
}

export async function download(source: string, destination: string) {
  const response = await fetch(source);
  const blob = await response.blob();

  const buf = await blob.arrayBuffer();
  const data = new Uint8Array(buf);

  const file = await Deno.create(destination);

  await Deno.writeAll(file, data);

  Deno.close(file.rid);
}
