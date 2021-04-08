// Serve a collection of p5 sketches

import { Args } from "../../deps.ts";
import { isCollection } from "../utils.ts";
import start from "../server/server.ts";

export default async (args: Args) => {
  // Exit if not in collection
  if (!await isCollection(Deno.cwd())) {
    return console.log("You are not in a p5 collection!");
  }

  const path = Deno.cwd();
  const port = args.p ?? args.port ?? 8080;

  // Start server
  await start(path, port);
};
