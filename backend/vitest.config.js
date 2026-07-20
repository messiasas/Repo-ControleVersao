import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./tests/setup.js"], // antes de qualquer teste, execute setup.js
  },
});