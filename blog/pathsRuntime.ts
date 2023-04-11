import path from "path";

/**
 * This path runs at runtime on the deployed app. Be warned that in the deployed app
 * and in dev mode, this will point to `/public`. But if imported from a Node script on
 * your local system, it will point to `/blog/posts`.
 */
export const POSTS_RUNTIME_DIR = path.join(__dirname, ".", "posts");
