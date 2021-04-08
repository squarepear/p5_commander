// Run server

import {
  Oak,
  Router,
  adapterFactory,
  basename,
  engineFactory,
  join,
  send,
  viewEngine,
} from "../../deps.ts";

import { root } from "../../mod.ts";

export default async (
  path: string,
  port: number,
  developmentMode = false,
) => {
  const valid =
    !(typeof (port) !== "number" || Math.floor(port) != port || port <= 0);

  // Exit if port is invalid
  if (!valid) return console.log("Invalid port!");

  const collection = basename(path);
  const sketches: string[] = [];

  const data = { collection, sketches };

  const viewsPath = join(root, "src", "server", "views");
  const staticPath = join(root, "src", "server", "static");
  const librariesPath = join(path, "libraries");
  const sketchesPath = join(path, "sketches");

  // Get all sketches
  for await (const entry of Deno.readDir(sketchesPath)) {
    if (entry.isDirectory) sketches.push(entry.name);
  }

  const handlebarsEngine = engineFactory.getHandlebarsEngine();
  const oakAdapter = adapterFactory.getOakAdapter();
  const app = new Oak();

  // Use handlebars template engine
  app.use(viewEngine(oakAdapter, handlebarsEngine));

  // Create router
  const router = new Router()
    .get("/", (ctx) => {
      ctx.render(join(viewsPath, "index.handlebars"), data);
    })
    .get("/sketch/:sketch/:file", async (ctx) => {
      if (!ctx.params?.sketch || !ctx.params?.file) return;

      if (ctx.params.file == "index.html") {
        await ctx.render(
          join(sketchesPath, ctx.params.sketch, ctx.params.file),
          data,
        );
      } else {
        await send(ctx, ctx.params.file, {
          root: join(sketchesPath, ctx.params.sketch),
        });
      }
    })
    .get("/sketch/:sketch", async (ctx) => {
      if (!ctx.params?.sketch) return;

      await ctx.render(
        join(viewsPath, "sketch.handlebars"),
        {
          ...data,
          sketch: ctx.params.sketch,
          developmentMode,
          host: ctx.request.url.host,
        },
      );
    })
    .get("/libraries/:file", async (ctx) => {
      if (!ctx.params?.file) return;

      await send(ctx, ctx.params.file, {
        root: librariesPath,
      });
    })
    .get("/static/:file", async (ctx) => {
      if (!ctx.params?.file) return;

      await send(ctx, ctx.params.file, {
        root: staticPath,
      });
    });

  // Development mode auto-reloading
  if (developmentMode) {
    router.get("/socket/:sketch", async (ctx) => {
      if (!ctx.params?.sketch || !ctx.isUpgradable) return;

      // Create socket
      const sock = await ctx.upgrade();

      // Create file watcher
      const watcher = Deno.watchFs(join(path, "sketches", ctx.params.sketch));

      // Listen for file update
      for await (const event of watcher) {
        // Close file watcher if socket is closed
        if (sock.isClosed) return;

        // Notify socket on file reload
        await sock.send("reload");
      }
    });
  }

  // Use router
  app.use(router.routes());
  app.use(router.allowedMethods());

  // Log on server start
  app.addEventListener("listen", ({ hostname, port, secure }) => {
    console.log(
      `Listening on: ${secure ? "https://" : "http://"}${hostname ??
        "localhost"}:${port}`,
    );
  });

  // Start server
  await app.listen({ port });
};
