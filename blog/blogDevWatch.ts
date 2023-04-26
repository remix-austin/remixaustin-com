import fs from "fs";
import syncDirectory from "sync-directory";
import { writeFrontMatterCache } from "./writeFrontMatterCache";
import { POSTS_SOURCE_DIR } from "./paths";
import { POSTS_BUILD_DIR } from "./paths";

writeFrontMatterCache();
if (!fs.existsSync(POSTS_SOURCE_DIR)) {
  fs.mkdirSync(POSTS_SOURCE_DIR);
}
fs.watch(POSTS_SOURCE_DIR, () => {
  writeFrontMatterCache();
});
syncDirectory(POSTS_SOURCE_DIR, POSTS_BUILD_DIR, {
  watch: true,
});
