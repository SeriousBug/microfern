/// <reference types="vitest" />
import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import camelCase from "camelcase";
import packageJson from "./package.json";
import { BrowserConfigOptions, VitestEnvironment } from "vitest";

const packageName = packageJson.name.split("/").pop() || packageJson.name;

const testRuntime = process.env.TEST_RUNTIME || "node";
console.log("testRuntime", testRuntime);

function getBrowserConfig(): BrowserConfigOptions | undefined {
  if (testRuntime === "chrome") {
    return {
      name: "chrome",
      headless: true,
    };
  }
  if (testRuntime === "firefox") {
    return {
      name: "firefox",
      headless: true,
    };
  }
}

function getEnvironmentConfig(): VitestEnvironment | undefined {
  if (testRuntime === "node") {
    return "node";
  }
  if (testRuntime === "edge") {
    return "edge-runtime";
  }
}

function getCoverageConfig() {
  if (process.env.TEST_RUNTIME === "node") {
    return {
      provider: "v8",
    } as const;
  }

  return {};
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
  test: {
    browser: getBrowserConfig(),
    environment: getEnvironmentConfig(),
    coverage: getCoverageConfig(),
  },
});
