// Run server

import { join, opine, serveStatic } from "../deps.ts";

export async function start(path: string, port: number) {
  const valid =
    !(typeof (port) !== "number" || Math.floor(port) != port || port <= 0);

  if (!valid) return console.log("Invalid port!");

  const librariesPath = join(path, "libraries");
  const sketchesPath = join(path, "sketches");
  const sketches: string[] = [];

  for await (const entry of Deno.readDir(sketchesPath)) {
    if (entry.isDirectory) sketches.push(entry.name);
  }

  const app = opine();

  app.use(serveStatic(path));

  app.get("/", (req, res) => {
    let data = "";

    for (const sketch of sketches) {
      data += `<a href="/sketches/${sketch}/index.html">${sketch}</a><br>`;
    }

    res.send(data);
  });

  app.get("/sketch/:sketch", (req, res) => {
    res.render(`${req.params.sketch}/index`);
  });

  app.listen(port, () => console.log(`Started on http://localhost:${port}`));
}
