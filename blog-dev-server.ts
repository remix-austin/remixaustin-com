import { watch } from "fs";
import { POST_DIR, getPostCacheFileContents } from "./blog-content/buildPosts";
import http from "http";
import { WebSocketServer } from "ws";

let source = "";
(async () => {
  source = await getPostCacheFileContents();
})();
const server = http.createServer((req, res) => {
  if (req.url?.includes("post-cache.json")) {
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(source);
  } else {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Not supposed to be here.");
  }
});
server.listen(8080, "localhost");

const wss = new WebSocketServer({ port: 8081 });

wss.on("connection", function (ws) {
  watch(POST_DIR, async () => {
    source = await getPostCacheFileContents();
    // /**
    //  * This line makes an arbitrary change in the `app` folder so that the
    //  * Remix preview server will auto-refresh because it detected a change.
    //  */
    // writeFileSync(POST_APP_DIR, `export default "${Date.now()}";`, "utf-8");
    ws.send(`{ "type": "RELOAD" }`);
  });
});
