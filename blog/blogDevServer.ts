import http from "http";
import fs from "fs";
import { watch } from "chokidar";
import { type WebSocket, WebSocketServer } from "ws";
import { buildFrontMatter } from "./buildFrontMatter";
import { FRONT_MATTER_CACHE_FILENAME, POSTS_SOURCE_DIR } from "./paths";
import { extractImports } from "./extractImports";
import { parseMdx } from "./parser";
import path from "path";

let localCache: string = "[]";
let localCacheError: Error | undefined;
/**
 * It's async because of odd ECONNREFUSED errors thrown by the server below
 * when running on dev mode otherwise.
 */
async function createLocalCacheData() {
  try {
    localCache = buildFrontMatter();
    localCacheError = undefined;
  } catch (e) {
    localCacheError = e as Error;
    console.error(localCacheError.stack);
  }
}
createLocalCacheData().then(() => {
  /**
   * This server will serve a cached version of the posts
   * compiled to JSON
   */
  const server = http.createServer((req, res) => {
    if (req.url?.includes(FRONT_MATTER_CACHE_FILENAME)) {
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Cache-Control", "no-store");
      if (localCacheError) {
        res.writeHead(
          500,
          "There was a problem creating blog front matter cache"
        );
        res.end();
      } else {
        res.writeHead(200);
        res.end(localCache);
      }
    } else if (req.url?.includes(".mdx")) {
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Cache-Control", "no-store");
      const urlPieces = req.url.split("/");
      const slug = urlPieces[urlPieces.length - 1];
      const postContents = fs
        .readFileSync(path.join(POSTS_SOURCE_DIR, slug))
        .toString("utf-8");
      Promise.resolve(extractImports(POSTS_SOURCE_DIR, postContents))
        .then((postImports) => {
          return parseMdx(postContents, slug, POSTS_SOURCE_DIR, postImports);
        })
        .then((mdx) => {
          res.writeHead(200);
          res.end(JSON.stringify(mdx));
        })
        .catch((error: Error) => {
          res.writeHead(500, `There was a problem parsing blog for ${slug}`);
          console.error(error.stack);
          res.end();
        });
    } else {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain");
      res.end("No content to be served here");
    }
  });
  server.listen(8080, "localhost");
});

/**
 * This web socket has a component listening in the app
 * on dev mode. It's also watching the post files for changes.
 * If a change is made to a post, move those changes over to
 * the public folder
 */
const wss = new WebSocketServer({ port: 8081 });
let socket!: WebSocket;
wss.on("connection", function (ws) {
  socket = ws;
});
watch(POSTS_SOURCE_DIR, { ignoreInitial: true }).on("all", async () => {
  await createLocalCacheData();
  socket?.send(`{ "type": "RELOAD" }`);
});
