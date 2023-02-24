import type { NodeJS } from "../types/global";

/**
 * Get environment variables from the server config
 *
 * @returns A config object containing environment variables.
 */
const getEnv = (): NodeJS.ProcessEnv => {
  return {
    NODE_ENV: process.env.NODE_ENV,
    npm_package_version: process.env.npm_package_version,
    PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
    SENTRY_ENVIRONMENT: process.env.SENTRY_ENVIRONMENT,
  };
};

export default getEnv;
