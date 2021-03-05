// Make a new p5 collection

import { Args, ensureDir, exists, join } from "../../deps.ts";
import { download, isCollection } from "../utils.ts";

export default async (args: Args) => {
  if (args._.length != 2) {
    return console.log("Must supply a name for the collection!");
  }
  if (await isCollection(Deno.cwd())) {
    return console.log("You are already in a p5 collection!");
  }

  const name = args._[1].toString();
  const path = join(Deno.cwd(), name);

  if (await exists(path)) return console.log(`${name} already exists!`);

  await ensureDir(join(path, "libraries"));
  await ensureDir(join(path, "sketches"));

  console.log("Downloading necessary p5 libraries and typings");

  await download(
    "https://github.com/processing/p5.js/releases/download/1.2.0/p5.js",
    join(path, "libraries/p5.js"),
  );

  // TODO: Download extra p5 libraries and typings

  console.log("Collection created!");
};
