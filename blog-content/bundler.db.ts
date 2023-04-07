import type { Mdx } from "./bundler";

export const POST_CACHE_FILENAME = "post-cache.json";

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
