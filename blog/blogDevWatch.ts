import fs from "fs";
import syncDirectory from "sync-directory";
import { buildFrontMatterCache } from "./buildFrontMatterCache";
import { POSTS_SOURCE_DIR } from "./paths";
import { POSTS_BUILD_DIR } from "./paths";

buildFrontMatterCache();
if (!fs.existsSync(POSTS_SOURCE_DIR)) {
  fs.mkdirSync(POSTS_SOURCE_DIR);
}
fs.watch(POSTS_SOURCE_DIR, () => {
  buildFrontMatterCache();
});
syncDirectory(POSTS_SOURCE_DIR, POSTS_BUILD_DIR, {
  watch: true,
});
