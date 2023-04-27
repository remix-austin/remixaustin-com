import { server } from "../mocks/server";
import { rest } from "msw";
import type { LoaderArgs } from "@remix-run/server-runtime";

export function mockUrlResponse<T>({
  url,
  body,
}: {
  url: string | URL;
  body?: T;
}) {
  server.use(
    rest.get(new URL(url).href, async (req, res, context) => {
      if (body) {
        return res(context.status(200), context.json(body));
      }
      return res(context.status(500));
    })
  );
}

function buildUrl(url: URL | string, params?: Record<string, string>) {
  const builtUrl = new URL(url);
  if (params) {
    builtUrl.search = new URLSearchParams(params).toString();
  }
  return builtUrl;
}

export function urlToLoaderArgs(
  url: URL | string,
  params?: Record<string, string>
): LoaderArgs {
  return {
    request: new Request(buildUrl(url, params)),
    context: {},
    params: {},
  };
}
