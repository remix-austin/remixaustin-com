import path from "path";

export const POST_CACHE_FILENAME = "post-cache.json";
export const POST_DIR = path.join(__dirname, ".", "posts");
export const POST_CACHE_DIR = path.join(__dirname, "..", "public");
export const COMPONENT_DIR = path.join(POST_DIR, "components");
export const POST_CACHE_FILEPATH = path.join(
  POST_CACHE_DIR,
  POST_CACHE_FILENAME
);
