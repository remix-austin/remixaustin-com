import type {
  PostFrontMatterWithSlug,
  PostFrontMatterCollection,
} from "./models";
import { FRONT_MATTER_CACHE_FILENAME, POSTS_BUILD_DIR } from "./paths";
import { getComponents } from "./getComponents";
import { type Mdx, parseMdx } from "./parser";

export async function getAllFrontMatter(origin: string) {
  let url = new URL(FRONT_MATTER_CACHE_FILENAME, origin);
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(`Could not retrieve posts. ${response.statusText}`);
    }
    return response.json() as Promise<PostFrontMatterCollection>;
  });
}

export async function getPost(origin: string, slug: string): Promise<Mdx> {
  const url = new URL(`${origin}/posts/${slug}.mdx`);
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Could not retrieve post. ${response.statusText}`);
      }
      return response.text();
    })
    .then((postContents) => {
      const components = getComponents();
      return parseMdx(postContents, slug, POSTS_BUILD_DIR, components);
    });
}

export async function getRecentPostFrontMatter(
  origin: string
): Promise<PostFrontMatterWithSlug> {
  let url = new URL(FRONT_MATTER_CACHE_FILENAME, origin);
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
