import path from "path";
import fs from "fs";
import fm from "front-matter";
import type {
  PostFrontMatter,
  PostFrontMatterCollection,
  PostFrontMatterGroup,
} from "./models";
import { POSTS_SOURCE_DIR } from "./pathsBuild";

//  The functions below are focused on taking all blog posts and compiling an
//  array for their front matter. This is primarily used for the blog page
//  where we list all blog posts starting from most recent. We don't need all the data from the blogs,
//  just their top level details.

function isMarkdownFilename(filename: unknown): filename is "*md" | "*mdx" {
  return (
    typeof filename === "string" &&
    (filename.endsWith("md") || filename.endsWith("mdx"))
  );
}

function reverseSort(a: PostFrontMatterGroup, b: PostFrontMatterGroup) {
  const aDate = new Date(a[1].date);
  const bDate = new Date(b[1].date);
  return bDate.getTime() - aDate.getTime();
}

export async function buildFrontMatter(): Promise<string> {
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
