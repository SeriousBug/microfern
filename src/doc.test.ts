import { format } from "./format";
import { DEFAULT_PLUGINS } from "./plugins";
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

  describe("custom-plugins.md", () => {
    function myPlugin(input: string): string {
      // Manipulate the string however you want here!
      const words = input.split(" ");
      return words.map((word) => `- ${word}\n`).join("");
    }

    test("my-plugin", () => {
      expect(
        format(
          "Some of my favorite fruits are:\n{{ fruits | myPlugin }}",
          { fruits: "apple banana orange" },
          { plugins: { myPlugin } }
        )
      ).toBe("Some of my favorite fruits are:\n- apple\n- banana\n- orange\n");
    });

    test("new-plugin", () => {
      expect(
        format(
          "I also like\n{{ vegetables | newPlugin }}",
          { vegetables: "broccoli carrot potato" },
          { plugins: { newPlugin: myPlugin } }
        )
      ).toBe("I also like\n- broccoli\n- carrot\n- potato\n");
    });

    test("combined", () => {
      expect(
        format(
          "I love these so much I have to scream!\n{{ favorites | uppercase | myPlugin }}",
          { favorites: "cookies cake chocolate" },
          { plugins: { ...DEFAULT_PLUGINS, myPlugin } }
        )
      ).toBe(
        "I love these so much I have to scream!\n- COOKIES\n- CAKE\n- CHOCOLATE\n"
      );
    });
  });
});
