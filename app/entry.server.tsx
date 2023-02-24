import { PassThrough } from "stream";
import type { EntryContext } from "@remix-run/node";
import { Response } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import isbot from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import * as Sentry from "@sentry/remix";
import getEnv from "./utils/errors.server";

// Init Sentry on the server
Sentry.init({
  dsn: "https://34c8ccc43eb048dc8bc97c56c9db3219:aec6646277604bfa8ed1f9c3907f2ec0@o4504646063489024.ingest.sentry.io/4504651149410304",

  // TODO: ❗️ Re-enable before merging. ❗️
  //          Disabled so as to not pollute the Sentry environments with garbage names.
  // environment: getEnv().SENTRY_ENVIRONMENT,
  environment: "staging",
  release: process.env.npm_package_version,
  tracesSampleRate: 1,
});

// TODO: Remove this from production after everything seems to work ok
// Log some helpful variables to the server console
console.log(`\n🪵  NODE_ENV="${getEnv().NODE_ENV}"`);
console.log(`🪵  SENTRY_ENVIRONMENT="${getEnv().SENTRY_ENVIRONMENT}"\n`);
const ABORT_DELAY = 5000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const callbackName = isbot(request.headers.get("user-agent"))
    ? "onAllReady"
    : "onShellReady";

  return new Promise((resolve, reject) => {
    let didError = false;

    const { pipe, abort } = renderToPipeableStream(
      <RemixServer context={remixContext} url={request.url} />,
      {
        [callbackName]: () => {
          const body = new PassThrough();

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(body, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            })
          );

          pipe(body);
        },
        onShellError: (err: unknown) => {
          reject(err);
        },
        onError: (error: unknown) => {
          didError = true;

          console.error(error);
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}
