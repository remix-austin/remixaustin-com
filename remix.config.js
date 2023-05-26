/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  cacheDirectory: "./node_modules/.cache/remix",
  future: {
    v2_errorBoundary: true,
    v2_meta: false,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
    unstable_dev: true,
  },
  ignoredRouteFiles: ["**/.*", "**/*.css", "**/*.test.{js,jsx,ts,tsx}"],
  serverDependenciesToBundle: [
    "remark-mdx-images",
    /^unist-util-.*/,
    /^mdx-bundler.*/,
  ],
  serverModuleFormat: "cjs",
  watchPaths: [
    "./blog/*.ts",
    "./public/posts",
    "./public/front-matter-cache.json",
  ],
};
