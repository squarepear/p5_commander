// Make a new p5 collection

import {
  Args,
  copy,
  ensureDir,
  exists,
  getReleaseURL,
  join,
  tgz,
} from "../../deps.ts";
import { download, isCollection } from "../utils.ts";

import { root } from "../../mod.ts";

export default async (args: Args) => {
  // Exit if received invalid arguments
  if (args._.length != 2) {
    return console.log("Must supply a name for the collection!");
  }
  // Exit if not in collection
  if (await isCollection(Deno.cwd())) {
    return console.log("You are already in a p5 collection!");
  }

  const name = args._[1].toString();
  const path = join(Deno.cwd(), name);
  const typesPath = join(path, "libraries", "@types");
  const templatePath = join(
    root,
    "templates/collection",
  );

  // Exit if directory already exists
  if (await exists(path)) return console.log(`${name} already exists!`);

  // Copy template to collection
  await copy(templatePath, path);

  // Ensure subdirectories exist
  await ensureDir(typesPath);
  await ensureDir(join(path, "sketches"));

  console.log("Downloading necessary p5 libraries and typings");

  // Get url to latest p5.js
  const p5Url = (await getReleaseURL({
    provider: "github",
    user: "processing",
    repo: "p5.js",
    part: "p5.min.js",
  }))[0];

  // Download p5.js to collection
  await download(
    p5Url,
    join(path, "libraries/p5.js"),
  );

  // Get url of latest p5.js typings
  const p5typesUrl =
    (await (await fetch("https://registry.npmjs.org/@types/p5/latest")).json())
      .dist.tarball;

  const tmpDir = await Deno.makeTempDir();
  const p5tgzPath = join(tmpDir, "p5.tar.gz");

  // Download typings tar.gz to tmp directory
  await download(p5typesUrl, p5tgzPath);

  // Decompress tar.gz to collection
  await tgz.uncompress(p5tgzPath, typesPath);

  // Remove temporary directory
  await Deno.remove(tmpDir, { recursive: true });

  console.log("Collection created!");
};
