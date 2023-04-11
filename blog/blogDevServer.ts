import http from "http";
import { watch } from "chokidar";
import { type WebSocket, WebSocketServer } from "ws";
import { rimrafSync } from "rimraf";
import { buildFrontMatter } from "./buildFrontMatter";
import {
  POSTS_BUILD_DIR,
  FRONT_MATTER_CACHE_FILENAME,
  POSTS_SOURCE_DIR,
} from "./pathsBuild";
import {
  copyAllPostContent,
  copyOnePostFile,
  deleteOnePostFile,
} from "./syncBlogContents";

rimrafSync(POSTS_BUILD_DIR);
copyAllPostContent(POSTS_SOURCE_DIR, POSTS_BUILD_DIR);
let localCache!: string;
async function createLocalCacheData() {
  localCache = await buildFrontMatter();
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
      res.writeHead(200);
      res.end(localCache);
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
watch(POSTS_SOURCE_DIR, { ignoreInitial: true }).on(
  "all",
  async (type, filepath) => {
    console.log(type);
    if (type === "add" || type === "change") {
      copyOnePostFile(filepath);
    } else if (type === "unlink") {
      deleteOnePostFile(filepath);
    } else if (type === "addDir" || type === "unlinkDir") {
      // For adding or removing entire directories, just whole hog
      // update. We don't have to be perfect right now 😜
      rimrafSync(POSTS_BUILD_DIR);
      copyAllPostContent(POSTS_SOURCE_DIR, POSTS_BUILD_DIR);
    }
    await createLocalCacheData();
    socket?.send(`{ "type": "RELOAD" }`);
  }
);
