/**
 * Node
 */
export namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: string | undefined;
    PORT: number | undefined;
    npm_package_version: string | undefined;
    SENTRY_ENVIRONMENT: string | undefined;
  }
}
