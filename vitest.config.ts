import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
    },
  },
  test: {
    globals: true,
    environment: "node",
    include: [
      "server/**/*.test.ts",
      "shared/**/*.test.ts",
    ],
    exclude: ["node_modules", "dist", ".cache"],
  },
});
