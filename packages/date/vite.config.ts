/// <reference types="vitest" />
import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { InlineConfig } from "vitest";

const testRuntime = process.env.TEST_RUNTIME || "node";
let testConfig: InlineConfig = {};

if (testRuntime === "node") {
  testConfig = {
    environment: "node",
    coverage: {
      provider: "v8",
    },
  };
}
// Not edge the browser, serverless edge computing runtime
if (testRuntime === "edge") {
  testConfig = {
    environment: "edge-runtime",
  };
}

if (["chrome", "firefox", "safari"].includes(testRuntime)) {
  testConfig = {
    browser: {
      provider: "webdriverio",
      name: testRuntime,
      enabled: true,
    },
  };
}

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/date.ts"),
      formats: ["es", "cjs"],
    },
  },
  plugins: [
    dts({
      rollupTypes: true,
    }),
  ],
  test: testConfig,
});
