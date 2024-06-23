import { describe, expect, test } from "vitest";
import { parseVariablesUsed } from "./parse-variables-used";

describe("GIVEN a template", () => {
  describe("WHEN the template contains variables", () => {
    test("THEN the variables are parsed", () => {
      const template = "Heirloom {{ fruit }} seeds";
      const variables = parseVariablesUsed(template);
      expect(variables).toEqual(["fruit"]);
    });
  });
});
