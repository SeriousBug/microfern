import { format } from "./format";
import { DEFAULT_PLUGINS } from "./plugins/base";
import { describe, expect, test } from "vitest";

/* 

If you need to change any of these tests, please make sure to update the
corresponding test in the documentation too!

*/

describe("doc examples", () => {
  describe("intro.md", () => {
    test("simple", () => {
      expect(
        format("{{ project }} templates look like this", {
          project: "microfern",
        })
      ).toBe("microfern templates look like this");
    });

    test("plugins", () => {
      expect(
        format(
          "{{ name | uppercase | snakeCase }} contains useful functions!",
          { name: "default plugins" },
          { plugins: DEFAULT_PLUGINS }
        )
      ).toBe("DEFAULT_PLUGINS contains useful functions!");
    });
  });
});
