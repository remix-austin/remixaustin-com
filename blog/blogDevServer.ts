import { watch } from "fs";
import { compilePostsToJson } from "./compileToJson";
import http from "http";
import { WebSocketServer } from "ws";
import { POST_DIR } from "./paths";

let source = "";
(async () => {
  source = await compilePostsToJson();
})();

/**
 * This server will serve a cached version of the posts
 * compiled to JSON
 */
const server = http.createServer((req, res) => {
  if (req.url?.includes("post-cache.json")) {
    res.setHeader("Content-Type", "application/json");
    /**
     * Ayyy @colbywhite!
     */
    res.setHeader("Cache-Control", "no-store");
    res.writeHead(200);
    res.end(source);
  } else {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Not supposed to be here.");
  }
});
server.listen(8080, "localhost");

/**
 * This web socket has a component listening in the app
 * on dev mode. It's also watching the post files for changes.
 * If a change is made to a post, recompile the posts as JSON
 * and trigger a browser reload.
 */
const wss = new WebSocketServer({ port: 8081 });
wss.on("connection", function (ws) {
  watch(POST_DIR, async () => {
    source = await compilePostsToJson();
    ws.send(`{ "type": "RELOAD" }`);
  });
});
