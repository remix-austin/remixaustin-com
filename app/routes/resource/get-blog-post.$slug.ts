import { type LoaderArgs } from "@remix-run/server-runtime";
import { getComponents } from "blog/getComponents";
import { parseMdx } from "blog/parser";
import { POSTS_BUILD_DIR } from "blog/paths";

export const loader = async function ({ request, params }: LoaderArgs) {
  const { slug = "" } = params;
  const url = new URL(`${new URL(request.url).origin}/posts/${slug}.mdx`);
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
};
