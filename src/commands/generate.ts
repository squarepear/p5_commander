// Make a new p5 sketch inside an existing collection

import { Args, copy, engineFactory, exists, join, walk } from "../../deps.ts";

import { isCollection } from "../utils.ts";
import { root } from "../../mod.ts";

export default async (args: Args) => {
  // Exit if received invalid arguments
  if (args._.length != 2) {
    return console.log("Must supply a name for the sketch!");
  }
  // Exit if not in collection
  if (!await isCollection(Deno.cwd())) {
    return console.log("You are not in a p5 collection!");
  }

  const name = args._[1].toString();
  const path = join(Deno.cwd(), "sketches", name);
  const templatePath = join(
    root,
    "templates/sketch",
  );

  // Exit if directory already exists
  if (await exists(path)) return console.log(`${name} already exists!`);

  // Copy template to collection
  await copy(templatePath, path);

  const handlebarsEngine = engineFactory.getHandlebarsEngine();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const data = {
    name,
  };

  // Replace all temporary data using handlebars
  for await (const entry of walk(path, { includeDirs: false })) {
    await Deno.writeFile(
      entry.path,
      encoder.encode(handlebarsEngine(
        decoder.decode(await Deno.readFile(entry.path)),
        data,
      )),
    );
  }

  console.log("Sketch created!");
};
