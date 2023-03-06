// global-setup.ts
import type { FullConfig } from "@playwright/test";

async function globalSetup(config: FullConfig) {
  // TODO: This seems to only expose env vars to test files, not to the application.
  //       These env vars are currently also added to npm scripts.
  process.env.SENTRY_ENVIRONMENT = "playwright";
}

export default globalSetup;
