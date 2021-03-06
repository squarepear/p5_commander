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

export default async (path: string, port: number) => {
  const valid =
    !(typeof (port) !== "number" || Math.floor(port) != port || port <= 0);

  if (!valid) return console.log("Invalid port!");

  const collection = basename(path);
  const sketches: string[] = [];

  const data = { collection, sketches };

  const viewsPath = join(root, "src", "server", "views");
  const librariesPath = join(path, "libraries");
  const sketchesPath = join(path, "sketches");

  for await (const entry of Deno.readDir(sketchesPath)) {
    if (entry.isDirectory) sketches.push(entry.name);
  }

  const handlebarsEngine = engineFactory.getHandlebarsEngine();
  const oakAdapter = adapterFactory.getOakAdapter();
  const app = new Oak();

  app.use(viewEngine(oakAdapter, handlebarsEngine));

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
        { ...data, sketch: ctx.params.sketch },
      );
    })
    .get("/libraries/:file", async (ctx) => {
      if (!ctx.params?.file) return;

      await send(ctx, ctx.params.file, {
        root: librariesPath,
      });
    });

  app.use(router.routes());
  app.use(router.allowedMethods());

  app.addEventListener("listen", ({ hostname, port, secure }) => {
    console.log(
      `Listening on: ${secure ? "https://" : "http://"}${hostname ??
        "localhost"}:${port}`,
    );
  });

  await app.listen({ port });
};
