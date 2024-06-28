import { format } from "microfern";
import { DATE_PLUGINS } from "./date";
import { describe, expect, test } from "vitest";

describe("DATE_PLUGINS", () => {
  describe("toUnixTimestamp", () => {
    test("WHEN applied to an ISO date string, THEN it converts it to a Unix timestamp", () => {
      expect(
        format(
          "The Unix timestamp is {{ date | toUnixTimestamp }}",
          { date: "2023-03-25T12:00:00Z" },
          { plugins: DATE_PLUGINS }
        )
      ).toBe("The Unix timestamp is 1679745600");
    });

    test("WHEN applied to an invalid date string, THEN it should throw an error", () => {
      expect(() =>
        format(
          "{{ date | toUnixTimestamp }}",
          { date: "abc" },
          { plugins: DATE_PLUGINS }
        )
      ).toThrow("abc");
    });
  });

  describe("fromUnixTimestamp", () => {
    test("WHEN applied to a Unix timestamp, THEN it converts it to an ISO date string", () => {
      expect(
        format(
          "The ISO date is {{ timestamp | fromUnixTimestamp }}",
          { timestamp: "1679745600" },
          { plugins: DATE_PLUGINS }
        )
      ).toBe("The ISO date is 2023-03-25T12:00:00Z");
    });

    test("WHEN fromUnixTimestamp is applied to an invalid timestamp, THEN it should throw an error", () => {
      expect(() =>
        format(
          "{{ timestamp | fromUnixTimestamp }}",
          { timestamp: "xyz" },
          { plugins: DATE_PLUGINS }
        )
      ).toThrow("xyz");
    });
  });

  describe("toUnixTimestamp and fromUnixTimestamp", () => {
    test("WHEN applied in sequence, THEN they should return the original input", () => {
      const originalDate = "2023-03-25T12:00:00Z";
      expect(
        format(
          "{{ date | toUnixTimestamp | fromUnixTimestamp }}",
          { date: originalDate },
          { plugins: DATE_PLUGINS }
        )
      ).toBe(originalDate);
    });
  });
});
