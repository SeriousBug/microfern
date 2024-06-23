/// <reference types="vitest" />
import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import packageJson from "./package.json";
import { InlineConfig } from "vitest";
import type { InputOption } from "rollup";

const testRuntime = process.env.TEST_RUNTIME || "node";
console.log("testRuntime", testRuntime);

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

const entry: InputOption = Object.fromEntries(
  Object.values(packageJson.exports).map(
    (e) =>
      [
        e.import.replace(/^[.]\/dist\//, "").replace(/[.]js$/, ""),
        resolve(
          __dirname,
          e.import.replace(/^[.]\/dist/, "./src").replace(/[.]js$/, ".ts")
        ),
      ] as const
  )
);

export default defineConfig({
  build: {
    lib: {
      entry,
      formats: ["es", "cjs"],
    },
  },
  plugins: [dts({ rollupTypes: true })],
  test: testConfig,
});
