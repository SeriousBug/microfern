import { format } from "microfern";
import { DATE_PLUGINS } from "./date";
import { describe, expect, test } from "vitest";

describe("date.md", () => {
  test("basic", () => {
    expect(
      format(
        "I'll eat another apple on {{ date | toUnixTimestamp }}",
        { date: new Date().toString() },
        { plugins: { ...DATE_PLUGINS } }
      )
    ).toMatch(/I'll eat another apple on \d+/);
  });
});
