import { format } from "../format";
import { DEFAULT_PLUGINS } from "./";
import { describe, expect, test } from "vitest";

describe("DEFAULT_PLUGINS", () => {
  describe("uppercase", () => {
    test("WHEN applied to a lowercase string, THEN it converts it to uppercase", () => {
      expect(
        format(
          "The word {{ text | uppercase }} should be uppercase",
          { text: "hello" },
          { plugins: DEFAULT_PLUGINS }
        )
      ).toBe("The word HELLO should be uppercase");
    });
  });

  describe("lowercase", () => {
    test("WHEN applied to an uppercase string, THEN it converts it to lowercase", () => {
      expect(
        format(
          "The word {{ text | lowercase }} should be lowercase",
          { text: "HELLO" },
          { plugins: DEFAULT_PLUGINS }
        )
      ).toBe("The word hello should be lowercase");
    });
  });

  describe("capitalize", () => {
    test("WHEN applied to a string, THEN it capitalizes the first letter", () => {
      expect(
        format(
          "The phrase '{{ text | capitalize }}' should have its first letter capitalized",
          { text: "hello world" },
          { plugins: DEFAULT_PLUGINS }
        )
      ).toBe(
        "The phrase 'Hello world' should have its first letter capitalized"
      );
    });
  });

  describe("titleCase", () => {
    test("WHEN applied to a string, THEN it capitalizes the first letter of each word", () => {
      expect(
        format(
          "The title '{{ text | titleCase }}' should be in title case",
          { text: "hello world" },
          { plugins: DEFAULT_PLUGINS }
        )
      ).toBe("The title 'Hello World' should be in title case");
    });
  });

  describe("snakeCase", () => {
    test("WHEN applied to a string, THEN it converts it to snake_case", () => {
      expect(
        format(
          "The variable name {{ text | snakeCase }} should be in snake_case",
          { text: "hello world" },
          { plugins: DEFAULT_PLUGINS }
        )
      ).toBe("The variable name hello_world should be in snake_case");
    });
  });

  describe("kebabCase", () => {
    test("WHEN applied to a string, THEN it converts it to kebab-case", () => {
      expect(
        format(
          "The CSS class {{ text | kebabCase }} should be in kebab-case",
          { text: "hello world" },
          { plugins: DEFAULT_PLUGINS }
        )
      ).toBe("The CSS class hello-world should be in kebab-case");
    });
  });

  describe("camelCase", () => {
    test("WHEN applied to a string, THEN it converts it to camelCase", () => {
      expect(
        format(
          "The JavaScript variable {{ text | camelCase }} should be in camelCase",
          { text: "hello world" },
          { plugins: DEFAULT_PLUGINS }
        )
      ).toBe("The JavaScript variable helloWorld should be in camelCase");
    });
  });

  describe("pascalCase", () => {
    test("WHEN applied to a string, THEN it converts it to PascalCase", () => {
      expect(
        format(
          "The class name {{ text | pascalCase }} should be in PascalCase",
          { text: "hello world" },
          { plugins: DEFAULT_PLUGINS }
        )
      ).toBe("The class name HelloWorld should be in PascalCase");
    });
  });

  describe("trim", () => {
    test("WHEN applied to a string with whitespace, THEN it removes whitespace from both ends", () => {
      expect(
        format(
          "The text '{{ text | trim }}' should have no leading or trailing spaces",
          { text: "  hello  " },
          { plugins: DEFAULT_PLUGINS }
        )
      ).toBe("The text 'hello' should have no leading or trailing spaces");
    });
  });

  describe("trimStart", () => {
    test("WHEN applied to a string with leading whitespace, THEN it removes whitespace from the start", () => {
      expect(
        format(
          "The text '{{ text | trimStart }}' should have no leading spaces",
          { text: "  hello  " },
          { plugins: DEFAULT_PLUGINS }
        )
      ).toBe("The text 'hello  ' should have no leading spaces");
    });
  });

  describe("trimEnd", () => {
    test("WHEN applied to a string with trailing whitespace, THEN it removes whitespace from the end", () => {
      expect(
        format(
          "The text '{{ text | trimEnd }}' should have no trailing spaces",
          { text: "  hello  " },
          { plugins: DEFAULT_PLUGINS }
        )
      ).toBe("The text '  hello' should have no trailing spaces");
    });
  });

  describe("urlEscape", () => {
    test("WHEN applied to a string with special characters, THEN it URL encodes the string", () => {
      expect(
        format(
          "The URL-encoded string is {{ text | urlEscape }}",
          { text: "hello world & more" },
          { plugins: DEFAULT_PLUGINS }
        )
      ).toBe("The URL-encoded string is hello%20world%20%26%20more");
    });
  });

  describe("urlUnescape", () => {
    test("WHEN applied to a URL encoded string, THEN it decodes the string", () => {
      expect(
        format(
          "The decoded URL string is {{ text | urlUnescape }}",
          { text: "hello%20world%20%26%20more" },
          { plugins: DEFAULT_PLUGINS }
        )
      ).toBe("The decoded URL string is hello world & more");
    });
  });

  describe("reverse", () => {
    test("WHEN applied to a string, THEN it reverses the string", () => {
      expect(
        format(
          "The reversed string is {{ text | reverse }}",
          { text: "hello" },
          { plugins: DEFAULT_PLUGINS }
        )
      ).toBe("The reversed string is olleh");
    });
  });

  describe("escapeHtml", () => {
    test("WHEN applied to a string with HTML special characters, THEN it escapes them", () => {
      expect(
        format(
          "The HTML-escaped string is {{ text | escapeHtml }}",
          { text: "<h1>Hello & World</h1>" },
          { plugins: DEFAULT_PLUGINS }
        )
      ).toBe(
        "The HTML-escaped string is &lt;h1&gt;Hello &amp; World&lt;/h1&gt;"
      );
    });
  });

  describe("unescapeHtml", () => {
    test("WHEN applied to a string with escaped HTML characters, THEN it unescapes them", () => {
      expect(
        format(
          "The unescaped HTML string is {{ text | unescapeHtml }}",
          { text: "&lt;h1&gt;Hello &amp; World&lt;/h1&gt;" },
          { plugins: DEFAULT_PLUGINS }
        )
      ).toBe("The unescaped HTML string is <h1>Hello & World</h1>");
    });
  });

  describe("stripHtml", () => {
    test("WHEN applied to a string with HTML tags, THEN it removes the HTML tags", () => {
      expect(
        format(
          "The plain text content is {{ text | stripHtml }}",
          { text: "<h1>Hello</h1> <p>World</p>" },
          { plugins: DEFAULT_PLUGINS }
        )
      ).toBe("The plain text content is Hello World");
    });
  });
});
