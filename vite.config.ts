import { unstable_vitePlugin as remix } from "@remix-run/dev";
import { defineConfig, configDefaults } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";

export default defineConfig({
  plugins: [
    remix(),
    tsconfigPaths(),
    mdx({ remarkPlugins: [remarkFrontmatter] }),
  ],
  test: {
    exclude: [...configDefaults.exclude, "e2e/**"],
    environment: "jsdom",
    setupFiles: ["./test/setup-test-env.ts"],
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
});
