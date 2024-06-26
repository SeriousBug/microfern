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
          "The ISO date is {{ timestamp | toISODateTime }}",
          { timestamp: "1679745600" },
          { plugins: DATE_PLUGINS }
        )
      ).toBe("The ISO date is 2023-03-25T12:00:00Z");
    });

    test("WHEN fromUnixTimestamp is applied to an invalid timestamp, THEN it should throw an error", () => {
      expect(() =>
        format(
          "{{ timestamp | toISODateTime }}",
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
          "{{ date | toUnixTimestamp | toISODateTime }}",
          { date: originalDate },
          { plugins: DATE_PLUGINS }
        )
      ).toBe(originalDate);
    });
  });

  describe("addTime", () => {
    test("WHEN adding days to a date, THEN it should return the correct future date", () => {
      expect(
        format(
          "{{ date | addTime 5 days }}",
          { date: "2023-03-25T12:00:00Z" },
          { plugins: DATE_PLUGINS }
        )
      ).toBe("2023-03-30T12:00:00Z");
    });

    test("WHEN adding hours to a date, THEN it should return the correct future date and time", () => {
      expect(
        format(
          "{{ date | addTime 3 hours }}",
          { date: "2023-03-25T12:00:00Z" },
          { plugins: DATE_PLUGINS }
        )
      ).toBe("2023-03-25T15:00:00Z");
    });

    test("WHEN adding months to a date, THEN it should return the correct future date", () => {
      expect(
        format(
          "{{ date | addTime 2 months }}",
          { date: "2023-03-25T12:00:00Z" },
          { plugins: DATE_PLUGINS }
        )
      ).toBe("2023-05-25T12:00:00Z");
    });

    test("WHEN adding years to a date, THEN it should return the correct future date", () => {
      expect(
        format(
          "{{ date | addTime 1 years }}",
          { date: "2023-03-25T12:00:00Z" },
          { plugins: DATE_PLUGINS }
        )
      ).toBe("2024-03-25T12:00:00Z");
    });

    test("WHEN adding time to an invalid date, THEN it should throw an error", () => {
      expect(() =>
        format(
          "{{ date | addTime 1 days }}",
          { date: "invalid-date" },
          { plugins: DATE_PLUGINS }
        )
      ).toThrow("Invalid date: invalid-date");
    });

    test("WHEN using an invalid time unit, THEN it should throw an error", () => {
      expect(() =>
        format(
          "{{ date | addTime 1 decades }}",
          { date: "2023-03-25T12:00:00Z" },
          { plugins: DATE_PLUGINS }
        )
      ).toThrow("Invalid date unit: decades");
    });

    test("WHEN using an invalid time amount, THEN it should throw an error", () => {
      expect(() =>
        format(
          "{{ date | addTime x days }}",
          { date: "2023-03-25T12:00:00Z" },
          { plugins: DATE_PLUGINS }
        )
      ).toThrow("Invalid");
    });
  });

  describe("subtractTime", () => {
    test("WHEN subtracting days from a date, THEN it should return the correct past date", () => {
      expect(
        format(
          "{{ date | subtractTime 5 days }}",
          { date: "2023-03-25T12:00:00Z" },
          { plugins: DATE_PLUGINS }
        )
      ).toBe("2023-03-20T12:00:00Z");
    });

    test("WHEN subtracting hours from a date, THEN it should return the correct past date and time", () => {
      expect(
        format(
          "{{ date | subtractTime 3 hours }}",
          { date: "2023-03-25T12:00:00Z" },
          { plugins: DATE_PLUGINS }
        )
      ).toBe("2023-03-25T09:00:00Z");
    });

    test("WHEN subtracting months from a date, THEN it should return the correct past date", () => {
      expect(
        format(
          "{{ date | subtractTime 2 months }}",
          { date: "2023-03-25T12:00:00Z" },
          { plugins: DATE_PLUGINS }
        )
      ).toBe("2023-01-25T12:00:00Z");
    });

    test("WHEN subtracting years from a date, THEN it should return the correct past date", () => {
      expect(
        format(
          "{{ date | subtractTime 1 years }}",
          { date: "2023-03-25T12:00:00Z" },
          { plugins: DATE_PLUGINS }
        )
      ).toBe("2022-03-25T12:00:00Z");
    });

    test("WHEN subtracting time from an invalid date, THEN it should throw an error", () => {
      expect(() =>
        format(
          "{{ date | subtractTime 1 days }}",
          { date: "invalid-date" },
          { plugins: DATE_PLUGINS }
        )
      ).toThrow("Invalid date: invalid-date");
    });

    test("WHEN using an invalid time unit, THEN it should throw an error", () => {
      expect(() =>
        format(
          "{{ date | subtractTime 1 decades }}",
          { date: "2023-03-25T12:00:00Z" },
          { plugins: DATE_PLUGINS }
        )
      ).toThrow("Invalid date unit: decades");
    });
  });

  describe("addTime and subtractTime", () => {
    test("WHEN adding and then subtracting the same amount of time, THEN it should return the original date", () => {
      const originalDate = "2023-03-25T12:00:00Z";
      expect(
        format(
          "{{ date | addTime 10 days | subtractTime 10 days }}",
          { date: originalDate },
          { plugins: DATE_PLUGINS }
        )
      ).toBe(originalDate);
    });
  });

  describe("formatDateTime", () => {
    const testDate = "2023-03-25T12:30:45Z";

    test("WHEN applied with a single format string, THEN it formats the date accordingly", () => {
      expect(
        format(
          "The formatted date is {{ date | formatDateTime yyyy-MM-dd }}",
          { date: testDate },
          { plugins: DATE_PLUGINS }
        )
      ).toBe("The formatted date is 2023-03-25");
    });

    test("WHEN applied with multiple format strings, THEN it combines them", () => {
      expect(
        format(
          "The formatted date and time is {{ date | formatDateTime yyyy-MM-dd HH:mm:ss }}",
          { date: testDate },
          { plugins: DATE_PLUGINS }
        )
      ).toBe("The formatted date and time is 2023-03-25 12:30:45");
    });

    test("WHEN applied with a custom format, THEN it formats the date accordingly", () => {
      expect(
        format(
          "The custom formatted date is {{ date | formatDateTime do 'of' MMMM, yyyy }}",
          { date: testDate },
          { plugins: DATE_PLUGINS }
        )
      ).toBe("The custom formatted date is 25th of March, 2023");
    });

    test("WHEN applied to an invalid date string, THEN it should throw an error", () => {
      expect(() =>
        format(
          "{{ date | formatDateTime yyyy-MM-dd }}",
          { date: "invalid-date" },
          { plugins: DATE_PLUGINS }
        )
      ).toThrow("Invalid date: invalid-date");
    });

    test("WHEN applied without format arguments, THEN it should throw an error", () => {
      expect(() =>
        format(
          "{{ date | formatDateTime }}",
          { date: testDate },
          { plugins: DATE_PLUGINS }
        )
      ).toThrow(
        'Invalid template: plugin "formatDateTime" requires options, but none were given.'
      );
    });

    test("WHEN used in combination with other date plugins, THEN it should work correctly", () => {
      expect(
        format(
          "The formatted timestamp is {{ date | toUnixTimestamp | toISODateTime | formatDateTime yyyy-MM-dd HH:mm:ss }}",
          { date: testDate },
          { plugins: DATE_PLUGINS }
        )
      ).toBe("The formatted timestamp is 2023-03-25 12:30:45");
    });
  });
});
