/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  cacheDirectory: "./node_modules/.cache/remix",
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
