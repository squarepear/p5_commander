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
  if (args._.length != 2) {
    return console.log("Must supply a name for the collection!");
  }
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

  if (await exists(path)) return console.log(`${name} already exists!`);

  await copy(templatePath, path);

  await ensureDir(typesPath);
  await ensureDir(join(path, "sketches"));

  console.log("Downloading necessary p5 libraries and typings");

  const p5Url = (await getReleaseURL({
    provider: "github",
    user: "processing",
    repo: "p5.js",
    part: "p5.min.js",
  }))[0];

  await download(
    p5Url,
    join(path, "libraries/p5.js"),
  );

  const p5typesUrl =
    (await (await fetch("https://registry.npmjs.org/@types/p5/latest")).json())
      .dist.tarball;

  const tmpDir = await Deno.makeTempDir();
  const p5tgzPath = join(tmpDir, "p5.tar.gz");

  await download(p5typesUrl, p5tgzPath);

  await tgz.uncompress(p5tgzPath, typesPath);

  await Deno.remove(tmpDir, { recursive: true });

  // TODO: Download extra p5 libraries and typings

  console.log("Collection created!");
};
