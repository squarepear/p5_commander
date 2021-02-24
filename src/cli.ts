// Determine which commands to run from command line interface

import { parse } from "../deps.ts";
import { run as runCreate } from "./commands/create.ts";
import { run as runNew } from "./commands/new.ts";
import { run as runServe } from "./commands/serve.ts";

const args = parse(Deno.args);

export function run() {
  switch (args._[0].toString().toLowerCase()) {
    case "create":
      runCreate(args);
      return;
    case "new":
      runNew(args);
      return;
    case "serve":
      runServe(args);
      return;
    default:
      console.log("Command not found!");
      return;
  }
}
