import { server } from "../mocks/server";
import type { DefaultBodyType } from "msw";
import { rest } from "msw";
import type { LoaderArgs } from "@remix-run/server-runtime";

/**
 * Use <code>msw</code> in order to mock a request with a specified response.
 * If a body is given then a 200 response with the given payload is mocked.
 * If no body is given then a 500 response is mocked.
 * @param url The request URL to mock
 * @param body The optional payload
 * @param body.json The optional payload to return with an <code>application/json</code> header.
 * @param body.text The optional payload to return with an <code>text/plain</code> header.
 */
export function mockUrlResponse<T extends DefaultBodyType>(
  url: string | URL,
  body?: { json: T } | { text: string }
) {
  server.use(
    rest.get(new URL(url).href, async (req, res, context) => {
      if (body === undefined) {
        return res(context.status(500));
      } else if ("json" in body) {
        return res(context.status(200), context.json(body.json));
      }
      return res(context.status(200), context.text(body.text));
    })
  );
}

function buildUrl(url: URL | string, search?: Record<string, string>) {
  const builtUrl = new URL(url);
  if (search) {
    builtUrl.search = new URLSearchParams(search).toString();
  }
  return builtUrl;
}

export function urlToLoaderArgs(
  url: URL | string,
  params?: { search?: Record<string, string>; path?: LoaderArgs["params"] }
): LoaderArgs {
  return {
    request: new Request(buildUrl(url, params?.search)),
    context: {},
    params: params?.path || {},
  };
}
