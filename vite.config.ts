import { unstable_vitePlugin as remix } from "@remix-run/dev";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    remix({
      ignoredRouteFiles: ["**/.*", "**/*.css", "**/*.test.{js,jsx,ts,tsx}"],
    }),
    tsconfigPaths(),
    // FIXME: Without this plugin, the `React` global is inserted without an
    // import causing errors; But including this plugin causes a client-side error
    // during dev due to multiple versions of the React Refresh (HMR) Runtime being loaded:
    // one by the Remix plugin and one by the React plugin.
    //
    // FIXME: This also causes an error when running the built site:
    // TypeError: jsxDEV is not a function
    // Without the `react` plugin, the error is:
    // ReferenceError: React is not defined
    react(),
  ],
  build: {
    rollupOptions: {
      // FIXME: For some reason, Vite is trying to resolve this module
      // from `node_modules/@esbuild-plugins/node-resolve/esm/index.js`.
      // It says to make it as external, but it's still throwing the error:
      // `Could not resolve "builtin-modules"`
      external: ["builtin-modules"],
    },
  },
  test: {
    exclude: [...configDefaults.exclude, "e2e/**"],
    globals: true,
    environment: "jsdom",
    setupFiles: ["./test/setup-test-env.ts"],
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
});

// TODO: Do we need this in Vite-land?
// watchPaths: [
//     "./blog/*.ts",
//     "./public/posts",
//     "./public/front-matter-cache.json",
// ],
