/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from "@vitejs/plugin-react";
import { configDefaults, defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
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
