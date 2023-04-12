import path from "path";
import fs from "fs";
import fm from "front-matter";
import type {
  PostFrontMatter,
  PostFrontMatterCollection,
  PostFrontMatterGroup,
} from "./models";
import { POSTS_SOURCE_DIR } from "./paths";

/**
 * Confirms the file is markdown or MDX
 * @param filename - the file name
 */
function isMarkdownFilename(filename: unknown): filename is "*md" | "*mdx" {
  return (
    typeof filename === "string" &&
    (filename.endsWith("md") || filename.endsWith("mdx"))
  );
}

/**
 * Sorts our front matter collection with most recent first
 * @param a - first group of `[slug, frontMatter]`
 * @param b - second group of `[slug, frontMatter]`
 */
function reverseSort(a: PostFrontMatterGroup, b: PostFrontMatterGroup) {
  const aDate = new Date(a[1].date);
  const bDate = new Date(b[1].date);
  return bDate.getTime() - aDate.getTime();
}

/**
 * Builds the front matter of all posts into a `PostFrontMatterCollection`
 * as a JSON string.
 */
export function buildFrontMatter(): string {
  if (!fs.existsSync(POSTS_SOURCE_DIR)) {
    return "";
  }
  const frontMatterCollection = fs
    .readdirSync(POSTS_SOURCE_DIR)
    .reduce((postMetadata: PostFrontMatterCollection, filename: string) => {
      if (!isMarkdownFilename(filename)) {
        return postMetadata;
      }
      /**
       * Get file contents
       */
      const filepath = path.join(POSTS_SOURCE_DIR, filename);
      const fileContents = fs.readFileSync(filepath).toString("utf-8");

      /**
       * Check for front matter and extract it
       */
      if (!/---/.test(fileContents)) {
        console.error("Blog post has no front matter! Skipping cache!");
        return postMetadata;
      }
      let frontmatter!: PostFrontMatter;
      try {
        frontmatter = fm<PostFrontMatter>(fileContents).attributes;
      } catch (e) {
        console.error("Could not parse blog front matter! Skipping cache!");
        return postMetadata;
      }
      return [
        ...postMetadata,
        [
          path.basename(filename, path.extname(filename)),
          frontmatter,
        ] as PostFrontMatterGroup,
      ];
    }, []);
  frontMatterCollection.sort(reverseSort);
  return JSON.stringify(frontMatterCollection);
}
