import { describe, expect, test } from "vitest";
import { format } from "../src/index";

describe("GIVEN a text with no symbols", () => {
  const template = "Fruit salad is delicious!";

  test("THEN the text is returned as-is", () => {
    expect(format(template, { fruit: "strawberry" })).toBe(
      "Fruit salad is delicious!"
    );
  });
});

describe("GIVEN a text with a symbol", () => {
  const template = "I like {{ fruit }} in my fruit salad.";

  describe("WHEN the variable matches the symbol", () => {
    const variables = { fruit: "cantaloupe" };
    test("THEN the symbol is replaced with the variable", () => {
      expect(format(template, variables)).toBe(
        "I like cantaloupe in my fruit salad."
      );
    });
  });

  describe("WHEN the variable does NOT match the symbol", () => {
    const variables = { topping: "almonds" };
    describe("AND `missingVariableDefault` is not set", () => {
      test("THEN the symbol is replaced with undefined", () => {
        expect(format(template, variables)).toBe(
          "I like undefined in my fruit salad."
        );
      });
    });

    describe("AND `missingVariableDefault` is set", () => {
      const options = { missingVariableDefault: "any fruit" };
      test("THEN the symbol is replaced with that string", () => {
        expect(format(template, variables, options)).toBe(
          "I like any fruit in my fruit salad."
        );
      });
    });
  });
});

// Write a test for the case when the template has multiple symbols.
describe("GIVEN a text with multiple symbols", () => {
  const template = "I like {{ fruit }} and {{ topping }} in my fruit salad.";

  describe("WHEN all variables match the symbols", () => {
    const variables = { fruit: "cantaloupe", topping: "almonds" };
    test("THEN all symbols are replaced with their variables", () => {
      expect(format(template, variables)).toBe(
        "I like cantaloupe and almonds in my fruit salad."
      );
    });
  });

  describe("WHEN one variable matches and the other does not", () => {
    const variables = { fruit: "cantaloupe", nuts: "walnuts" };
    describe("AND `missingVariableDefault` is not set", () => {
      test("THEN the matching symbol is replaced with its variable and the non-matching symbol is replaced with undefined", () => {
        expect(format(template, variables)).toBe(
          "I like cantaloupe and undefined in my fruit salad."
        );
      });
    });

    const options = { missingVariableDefault: "any topping" };
    test("AND `missingVariableDefault` is set, THEN the non-matching symbol is replaced with that string", () => {
      expect(format(template, variables, options)).toBe(
        "I like cantaloupe and any topping in my fruit salad."
      );
    });
  });

  describe("WHEN none of the variables match the symbols", () => {
    const variables = { veggie: "carrot", nuts: "walnuts" };
    describe("AND `missingVariableDefault` is not set", () => {
      test("THEN all symbols are replaced with undefined", () => {
        expect(format(template, variables)).toBe(
          "I like undefined and undefined in my fruit salad."
        );
      });
    });

    const options = { missingVariableDefault: "any ingredient" };
    test("AND `missingVariableDefault` is set, THEN all symbols are replaced with that string", () => {
      expect(format(template, variables, options)).toBe(
        "I like any ingredient and any ingredient in my fruit salad."
      );
    });
  });
});

describe("GIVEN a text with one or more comment blocks", () => {
  describe("WHEN the template includes a single comment block", () => {
    const template =
      "I like {{ fruit }}{# Remember to find more fruits! #} in my fruit salad.";
    const variables = { fruit: "cantaloupe" };
    test("THEN the comment block is removed from the output", () => {
      expect(format(template, variables)).toBe(
        "I like cantaloupe in my fruit salad."
      );
    });
  });

  describe("WHEN the template includes multiple comment blocks", () => {
    const template =
      "I like {{ fruit }}{# Remember to find more fruits! #} in my fruit salad{# Really? #}.";
    const variables = { fruit: "cantaloupe" };
    test("THEN all comment blocks are removed from the output", () => {
      expect(format(template, variables)).toBe(
        "I like cantaloupe in my fruit salad."
      );
    });
  });

  describe("WHEN there are nested comment blocks", () => {
    const template =
      "I like {{ fruit }}{# Oh, {# Really? #}#} Hmm #} in my fruit salad.";
    const variables = { fruit: "cantaloupe" };
    test("THEN an error is thrown", () => {
      expect(() => format(template, variables)).toThrow("Invalid template");
    });
  });

  describe("WHEN there is an unclosed comment block", () => {
    const template =
      "I like {{ fruit }}{# Remember to find more fruits! in my fruit salad.";
    const variables = { fruit: "cantaloupe" };
    test("THEN an error is thrown", () => {
      expect(() => format(template, variables)).toThrow("Invalid template");
    });
  });
});

describe("GIVEN a text with an escaped symbol", () => {
  const template = "I like \\{{ fruits.";
  const variables = { fruits: "cantaloupe" };
  test("THEN the symbol is not replaced", () => {
    expect(format(template, variables)).toBe("I like {{ fruits.");
  });
});
