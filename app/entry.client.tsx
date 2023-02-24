import { RemixBrowser } from "@remix-run/react";
import { useEffect, startTransition, StrictMode } from "react";
import { useLocation, useMatches } from "@remix-run/react";
import { hydrateRoot } from "react-dom/client";
import * as Sentry from "@sentry/remix";

// Init Sentry on the client
Sentry.init({
  dsn: "https://34c8ccc43eb048dc8bc97c56c9db3219:aec6646277604bfa8ed1f9c3907f2ec0@o4504646063489024.ingest.sentry.io/4504651149410304",
  // TODO: ❗️ Re-enable before merging. ❗️
  //          Disabled so as to not pollute the Sentry environments with garbage names.
  // environment: getEnv().SENTRY_ENVIRONMENT,
  environment: "staging",
  // release: process.env.npm_package_version,
  tracesSampleRate: 1,
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.remixRouterInstrumentation(
        useEffect,
        useLocation,
        useMatches
      ),
    }),
  ],
});

const hydrate = () => {
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <RemixBrowser />
      </StrictMode>
    );
  });
};

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  window.setTimeout(hydrate, 1);
}
