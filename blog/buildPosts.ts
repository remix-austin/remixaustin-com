import fs from "fs";
import path from "path";
import { compilePostsToJson } from "./compileToJson.js";
import { POST_CACHE_FILEPATH } from "./paths";

(async function writePostCache() {
  const content = await compilePostsToJson();
  fs.writeFileSync(POST_CACHE_FILEPATH, content, "utf-8");
  console.log("Wrote", path.relative(__dirname, POST_CACHE_FILEPATH));
})();
