import { type LoaderArgs } from "@remix-run/server-runtime";
import type {
  PostFrontMatterCollection,
  PostFrontMatterWithSlug,
} from "blog/models";
import { FRONT_MATTER_CACHE_FILENAME } from "blog/paths";

export const loader = async function ({
  request,
}: LoaderArgs): Promise<PostFrontMatterWithSlug> {
  const url = new URL(FRONT_MATTER_CACHE_FILENAME, new URL(request.url).origin);
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
};
