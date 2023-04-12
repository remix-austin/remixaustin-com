import fs from "fs";
import path from "path";
import { rimrafSync } from "rimraf";
import { buildFrontMatter } from "./buildFrontMatter";
import {
  POSTS_BUILD_DIR,
  FRONT_MATTER_CACHE_FILEPATH,
  POSTS_SOURCE_DIR,
} from "./paths";
import { copyAllPostContent } from "./copyAllPostContent";

(function buildPostsAndCache() {
  rimrafSync(POSTS_BUILD_DIR);
  copyAllPostContent(POSTS_SOURCE_DIR, POSTS_BUILD_DIR);
  const postCache = buildFrontMatter();
  if (postCache) {
    fs.writeFileSync(FRONT_MATTER_CACHE_FILEPATH, postCache, "utf-8");
    console.log("Wrote", path.relative(__dirname, FRONT_MATTER_CACHE_FILEPATH));
  }
})();
