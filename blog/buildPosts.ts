import syncDirectory from "sync-directory";
import { rimrafSync } from "rimraf";
import { writeFrontMatterCache } from "./writeFrontMatterCache";
import { POSTS_BUILD_DIR, POSTS_SOURCE_DIR } from "./paths";

(function buildPostsAndCache() {
  rimrafSync(POSTS_BUILD_DIR);
  syncDirectory(POSTS_SOURCE_DIR, POSTS_BUILD_DIR);
  writeFrontMatterCache();
})();
