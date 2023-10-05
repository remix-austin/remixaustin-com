import { type LoaderFunctionArgs } from "@remix-run/node";
import { type PostFrontMatterCollection } from "blog/models";
import { FRONT_MATTER_CACHE_FILENAME } from "blog/paths";

export const loader = async function ({
  request,
}: LoaderFunctionArgs): Promise<PostFrontMatterCollection> {
  const requestUrl = new URL(request.url);
  const pageNumber = Number(requestUrl.searchParams.get("page") ?? 1); // Page number is 1 based, not 0 based
  const pageSize = Number(requestUrl.searchParams.get("pageSize") ?? 10);
  const url = new URL(FRONT_MATTER_CACHE_FILENAME, requestUrl.origin);
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Could not retrieve posts. ${response.statusText}`);
      }
      return response.json() as Promise<PostFrontMatterCollection>;
    })
    .then((frontMatterArray) => {
      const start = (pageNumber - 1) * pageSize;
      const end = pageNumber * pageSize;
      return frontMatterArray.slice(start, end);
    });
};
