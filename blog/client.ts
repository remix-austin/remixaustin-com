import type {
  PostFrontMatterWithSlug,
  PostFrontMatterCollection,
} from "./models";
import { FRONT_MATTER_CACHE_FILENAME, POSTS_BUILD_DIR } from "./paths";
import { extractImports } from "./extractImports";
import { type Mdx, parseMdx } from "./parser";

export async function getPosts(origin: string) {
  let url: URL;
  if (process.env.NODE_ENV === "development") {
    url = new URL(`http://localhost:8080/${FRONT_MATTER_CACHE_FILENAME}`);
  } else {
    url = new URL(FRONT_MATTER_CACHE_FILENAME, origin);
  }
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(`Could not retrieve posts. ${response.statusText}`);
    }
    return response.json() as Promise<PostFrontMatterCollection>;
  });
}

export async function getPost(origin: string, slug: string): Promise<Mdx> {
  let url!: URL;
  if (process.env.NODE_ENV === "development") {
    url = new URL(`http://localhost:8080/posts/${slug}.mdx`);
    return fetch(url).then((response) => {
      if (!response.ok) {
        throw new Error(`Could not retrieve post. ${response.statusText}`);
      }
      return response.json();
    });
  } else {
    url = new URL(`${origin}/posts/${slug}.mdx`);
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Could not retrieve post. ${response.statusText}`);
        }
        return response.text();
      })
      .then((postContents) => {
        const postImports = extractImports(`${origin}/posts`, postContents);
        return parseMdx(postContents, slug, POSTS_BUILD_DIR, postImports);
      });
  }
}

export async function getRecentPostFrontMatter(
  origin: string
): Promise<PostFrontMatterWithSlug> {
  let url;
  if (process.env.NODE_ENV === "development") {
    url = new URL(`http://localhost:8080/${FRONT_MATTER_CACHE_FILENAME}`);
  } else {
    url = new URL(FRONT_MATTER_CACHE_FILENAME, origin);
  }
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Could not retrieve posts. ${response.statusText}`);
      }
      return response.json() as Promise<PostFrontMatterCollection>;
    })
    .then((frontMatterCollection) => {
      return frontMatterCollection[0];
    });
}
