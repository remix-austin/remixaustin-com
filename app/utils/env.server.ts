import invariant from "tiny-invariant";
/**
 * Process environment variables
 *
 * ❗️ These variables will be exposed to the public!
 *    Do NOT put secret data in the Env type!
 */
const getEnv = () => {
  invariant(
    process.env.SENTRY_ENVIRONMENT,
    "❗️ SENTRY_ENVIRONMENT is not defined!"
  );

  return {
    NODE_ENV: process.env.NODE_ENV,
    npm_package_version: process.env.npm_package_version,
    PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
    SENTRY_ENVIRONMENT: process.env.SENTRY_ENVIRONMENT,
  };
};

export type Env = ReturnType<typeof getEnv>;

export default getEnv;
