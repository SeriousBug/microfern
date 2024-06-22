/// <reference types="vitest" />
import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import camelCase from "camelcase";
import packageJson from "./package.json";
import { InlineConfig } from "vitest";

const packageName = packageJson.name.split("/").pop() || packageJson.name;

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
if (testRuntime === "edge") {
  testConfig = {
    environment: "edge-runtime",
  };
}
if (testRuntime === "chrome") {
  testConfig = {
    browser: {
      provider: "webdriverio",
      name: "chrome",
      enabled: true,
    },
  };
}
if (testRuntime === "firefox") {
  testConfig = {
    browser: {
      provider: "webdriverio",
      name: "firefox",
      enabled: true,
    },
  };
}

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es", "cjs", "umd", "iife"],
      name: camelCase(packageName, { pascalCase: true }),
      fileName: packageName,
    },
  },
  plugins: [dts({ rollupTypes: true })],
  test: testConfig,
});
