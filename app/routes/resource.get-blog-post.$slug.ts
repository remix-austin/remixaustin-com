import { type LoaderFunctionArgs } from "@remix-run/node";
import { bundleMdx } from "blog/parser.server";
import { POSTS_BUILD_DIR } from "blog/paths";
import invariant from "tiny-invariant";

export const loader = async function ({ request, params }: LoaderFunctionArgs) {
  const { slug } = params;
  invariant(slug, "Blog post slug was not provided!");
  const url = new URL(`${new URL(request.url).origin}/posts/${slug}.mdx`);
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Could not retrieve post. ${response.statusText}`);
      }
      return response.text();
    })
    .then((postContents) => {
      return bundleMdx(postContents, slug, POSTS_BUILD_DIR);
    });
};
