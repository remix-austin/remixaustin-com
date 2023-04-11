import path from "path";
import fs from "fs";

/**
 *
 * @param origin - the root of the filesystem where this function is being called. Important
 * because `fs` will use it to find the dependencies of the blog post
 * @param blogContents - the blog post raw contents
 * @returns {Record<string, string>} - the dependencies of the blog in a dictionary matching relative file
 * path to dependency source content
 */
export function extractImports(
  origin: string,
  blogContents: string
): Record<string, string> {
  const filePathPattern = "(./([a-zA-Z-]+/)*[a-zA-Z-]+)";
  const namedImportPattern = "({[a-zA-Z\\s,]+})";
  const defaultImportPattern = "([a-zA-Z]+)";
  const importPattern = `import (${defaultImportPattern}|${namedImportPattern}) from ["']${filePathPattern}["']`;
  const findImportsRegex = new RegExp(importPattern, "g");
  const found = (
    blogContents.match(findImportsRegex) ?? ([] as string[])
  ).reduce((acc, curr) => {
    const match = curr.match(filePathPattern);
    if (!match) {
      return acc;
    }
    const relativePath = match[0].replace(/["']/g, "");
    const absolutePath = path.join(origin, relativePath);
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
  return found;
}
