#!/usr/bin/env -S deno run -A --unstable

export const version = "0.0.1";

import { run } from "./src/cli.ts";

if (import.meta.main) run();
