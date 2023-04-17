import path from "path";
import fs from "fs";
import { POSTS_BUILD_DIR } from "./paths";

const COMPONENTS_DIR = path.join(POSTS_BUILD_DIR, "components");

/**
 *
 * Gets an object dictionary of all blog components, mapped from their relative file path
 * in the posts to their string source content.
 * @returns {Record<string, string>} - the dependencies of the blog in a dictionary matching relative file
 * path to dependency source content
 */
export function getComponents(): Record<string, string> {
  return fs.readdirSync(COMPONENTS_DIR).reduce((acc, filename) => {
    const absolutePath = path.join(COMPONENTS_DIR, filename);
    const relativePath = path.relative(POSTS_BUILD_DIR, absolutePath);
    const isTypescript = fs.existsSync(`${absolutePath}.ts`);
    const isTSX = fs.existsSync(`${absolutePath}.tsx`);
    if (!isTypescript && !isTSX) {
      return acc;
    }
    return {
      ...acc,
      [relativePath]: fs
        .readFileSync(`${absolutePath}${isTypescript ? ".ts" : ".tsx"}`)
        .toString("utf-8"),
    };
  }, {} as Record<string, string>);
}
