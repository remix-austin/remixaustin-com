import path from "path";
import fs from "fs";
import fm from "front-matter";
import type {
  PostFrontMatter,
  PostFrontMatterCollection,
  PostFrontMatterWithSlug,
} from "./models";
import { FRONT_MATTER_CACHE_FILEPATH, POSTS_SOURCE_DIR } from "./paths";
import invariant from "tiny-invariant";

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
 * @param a - front matter
 * @param b - front matter
 */
function reverseSort(a: PostFrontMatterWithSlug, b: PostFrontMatterWithSlug) {
  const aDate = new Date(a.date);
  const bDate = new Date(b.date);
  return bDate.getTime() - aDate.getTime();
}

function validateFrontMatter(
  frontMatter: Partial<PostFrontMatter>
): frontMatter is PostFrontMatter {
  const title = frontMatter.title;
  const author = frontMatter.author;
  const date = frontMatter.date;
  invariant(title, "A blog post was missing a title.");
  invariant(author, `Blog post ${title} was missing an author.`);
  invariant(date, `Blog post ${title} was missing an date.`);
  return true;
}

/**
 * Builds the front matter of all posts into a JSON array. It's also used for
 * e2e testing.
 */
export function buildFrontMatterCache(): PostFrontMatterCollection {
  if (!fs.existsSync(POSTS_SOURCE_DIR)) {
    return [];
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
      let frontMatter!: PostFrontMatter;
      try {
        frontMatter = fm<PostFrontMatter>(fileContents).attributes;
      } catch (e) {
        console.error("Could not parse blog front matter! Skipping cache!");
        return postMetadata;
      }
      try {
        validateFrontMatter(frontMatter);
      } catch (e) {
        console.error(
          (e as Error).message,
          "Skipping cache!",
          "Front matter received was",
          frontMatter
        );
        return postMetadata;
      }
      return [
        ...postMetadata,
        {
          ...frontMatter,
          slug: path.basename(filename, path.extname(filename)),
        },
      ];
    }, []);
  frontMatterCollection.sort(reverseSort);
  return frontMatterCollection;
}

/**
 * Takes the output of `buildFrontMatterCache` and writes it to a file
 */
export function writeFrontMatterCache(): void {
  const frontMatterCollection = buildFrontMatterCache();
  if (frontMatterCollection.length) {
    const contents = JSON.stringify(frontMatterCollection);
    fs.writeFileSync(FRONT_MATTER_CACHE_FILEPATH, contents, "utf-8");
    console.log("Wrote", path.relative(__dirname, FRONT_MATTER_CACHE_FILEPATH));
  }
}
