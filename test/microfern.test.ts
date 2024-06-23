import { describe, expect, test } from "vitest";
import { format } from "../src/microfern";

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

    describe("AND the variables are in a map", () => {
      const variables = new Map([["fruit", "cantaloupe"]]);
      test("THEN the symbol is replaced with the variable", () => {
        expect(format(template, variables)).toBe(
          "I like cantaloupe in my fruit salad."
        );
      });
    });

    describe("AND the variables are in a custom map implementation", () => {
      test("THEN the symbol is replaced with the variable", () => {
        class MyCustomMap {
          get(key: string) {
            return key.toUpperCase();
          }
        }
        expect(format("{{ fruit }}", new MyCustomMap())).toBe("FRUIT");
      });
    });

    describe("AND there is no whitespace around the symbol", () => {
      const template = "I like {{fruit}} in my fruit salad.";
      test("THEN the symbol is replaced with the variable", () => {
        expect(format(template, variables)).toBe(
          "I like cantaloupe in my fruit salad."
        );
      });
    });

    describe("AND there is a special character in the symbol name", () => {
      const template = "I like {{ fruit-1 }} in my fruit salad.";
      const variables = { "fruit-1": "cantaloupe" };
      test("THEN the symbol is replaced with the variable", () => {
        expect(format(template, variables)).toBe(
          "I like cantaloupe in my fruit salad."
        );
      });
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

  describe("WHEN the blcok is empty", () => {
    const template = "I like {{ }} in my fruit salad.";
    const variables = { fruit: "cantaloupe" };
    test("THEN an error is thrown", () => {
      expect(() => format(template, variables)).toThrow("Invalid template");
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

    describe("AND `missingVariableDefault` is set", () => {
      const options = { missingVariableDefault: "any topping" };
      test("THEN the non-matching symbol is replaced with that string", () => {
        expect(format(template, variables, options)).toBe(
          "I like cantaloupe and any topping in my fruit salad."
        );
      });

      describe("AND the missingVariableDefault is set to an empty string", () => {
        const options = { missingVariableDefault: "" };
        test("THEN the non-matching symbol is replaced with an empty string", () => {
          expect(format(template, variables, options)).toBe(
            "I like cantaloupe and  in my fruit salad."
          );
        });
      });

      describe("AND the missingVariableDefault is set to a number", () => {
        const options = { missingVariableDefault: 0 };
        test("THEN the non-matching symbol is replaced with the number", () => {
          expect(format(template, variables, options)).toBe(
            "I like cantaloupe and 0 in my fruit salad."
          );
        });
      });
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

  describe("WHEN there are multiple nested symbols", () => {
    const template = "I like {{ fruit {{ dessert }} }} a lot.";
    const variables = { fruit: "cantaloupe", dessert: "cake" };
    test("THEN an error is thrown", () => {
      expect(() => format(template, variables)).toThrow("Invalid template");
    });
  });
});

describe("GIVEN a text with one or more comment blocks", () => {
  describe("WHEN the template has no text besides the comment block", () => {
    const template = "{# Remember to find more fruits! #}";
    test("THEN the comment block is removed from the output", () => {
      expect(format(template, {})).toBe("");
    });
  });

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

  describe("AND the escape character is inside a block", () => {
    const template = "I like {{ fruits \\{{ }}.";
    test("THEN an error is thrown", () => {
      expect(() => format(template, variables)).toThrow("Invalid template");
    });
  });
});

describe("GIVEN a text with unmatched brackets", () => {
  describe("WHEN there is an unmatched opening curly bracket", () => {
    const template = "I like { fruit }} in my fruit salad.";
    test("THEN an error is thrown", () => {
      expect(() => format(template, {})).toThrow("Invalid template");
    });
  });

  describe("WHEN there is an unmatched closing curly bracket", () => {
    const template = "I like {{ fruit } in my fruit salad.";
    test("THEN an error is thrown", () => {
      expect(() => format(template, {})).toThrow("Invalid template");
    });
  });

  describe("WHEN there is an unmatched opening comment bracket", () => {
    const template = "I like {{ fruit }} in my fruit salad. {# Comment here";
    test("THEN an error is thrown", () => {
      expect(() => format(template, {})).toThrow("Invalid template");
    });
  });

  describe("WHEN there is an unmatched closing comment bracket", () => {
    const template = "I like {{ fruit }} in my fruit salad. #} Comment here";
    test("THEN an error is thrown", () => {
      expect(() => format(template, {})).toThrow("Invalid template");
    });
  });
});
