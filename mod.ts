#!/usr/bin/env -S deno run -A --unstable

export const root = new URL(".", import.meta.url).pathname;
export const version = "v1.0.0";

import run from "./src/cli.ts";

if (import.meta.main) run();
