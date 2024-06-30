import { isAbsolute, resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/date.ts"),
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      // Externalize deps, otherwise Vite will bundle them into this library,
      // and callers will get duplicate deps if they already have any of these
      // deps installed.
      external: (id) => !(isAbsolute(id) || id.startsWith(".")),
    },
  },
  plugins: [
    dts({
      rollupTypes: true,
    }),
  ],
});
