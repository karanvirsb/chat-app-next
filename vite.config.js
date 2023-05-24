import path from "path";
import AutoImport from "unplugin-auto-import/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    testTimeout: 30000,
  },
  alias: {
    "@": path.resolve(__dirname, "src"),
  },
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  plugins: [
    AutoImport({
      imports: ["vitest"],
      dts: true, // generate TypeScript declaration
    }),
  ],
});
