import type { Env } from "~/utils/env.server";

declare global {
  var env: Env;

  interface Window {
    env: Env;
  }
}
