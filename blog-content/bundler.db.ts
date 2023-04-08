import type { Mdx } from "./bundler";
import path from "path";
import fs from "fs";

export const POST_CACHE_FILENAME = "post-cache.json";
export const POST_CACHE_DIR_PROD = path.join(__dirname, "..", "public");
export const POST_CACHE_DIR_DEV = path.join(__dirname, "..", "app", "_posts");
export const POST_CACHE_FILEPATH_PROD = path.join(
  POST_CACHE_DIR_PROD,
  POST_CACHE_FILENAME
);
export const POST_CACHE_FILEPATH_DEV = path.join(
  POST_CACHE_DIR_DEV,
  POST_CACHE_FILENAME
);

function isDefinedString(val: unknown): val is string {
  return typeof val === "string";
}

function reverseSort(a: Mdx, b: Mdx) {
  if (
    !isDefinedString(a.frontmatter.date) ||
    !isDefinedString(b.frontmatter.date)
  ) {
    throw new Error("Missing dates");
  }
  const aDate = new Date(a.frontmatter.date);
  const bDate = new Date(b.frontmatter.date);
  return bDate.getTime() - aDate.getTime();
}

// TODO add paging
export async function getPosts(origin: string) {
  if (process.env.NODE_ENV === "development") {
    return JSON.parse(
      fs.readFileSync(POST_CACHE_FILEPATH_DEV, "utf-8")
    ) as Mdx[];
  }
  const url = new URL(POST_CACHE_FILENAME, origin);
  console.log("getPosts", url);
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Could not retrieve posts ${response.statusText}`);
      }
      return response.json() as Promise<Mdx[]>;
    })
    .then((posts) => {
      return posts
        .filter(
          ({ frontmatter }) =>
            isDefinedString(frontmatter.date) &&
            isDefinedString(frontmatter.title)
        )
        .sort(reverseSort);
    });
}

export async function getPost(origin: string, slug: string) {
  const posts = await getPosts(origin);
  return posts.find((post) => post.slug === slug);
}

export async function getRecentPost(origin: string, count = 10) {
  const posts = await getPosts(origin);
  return posts.slice(0, count);
}
