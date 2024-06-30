import type { Plugin, HigherOrderPlugin } from "microfern";
import * as date from "date-fns";

function parseInt(input: string): number {
  const parsed = Number.parseInt(input, 10);
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid integer: ${input}`);
  }
  return parsed;
}

type DateUnit = keyof date.Duration;
const dateUnits: ReadonlySet<string> = new Set<string>([
  "years",
  "months",
  "weeks",
  "days",
  "hours",
  "minutes",
  "seconds",
] as const);

function isDateUnit(input: string): input is DateUnit {
  return dateUnits.has(input);
}

function parseDateUnit(input: string): DateUnit {
  if (!isDateUnit(input)) {
    throw new Error(`Invalid date unit: ${input}`);
  }
  return input;
}

function parseDateInput(rawInput: string): Date {
  if (/^\d+$/.test(rawInput)) {
    return date.fromUnixTime(parseInt(rawInput));
  }
  const input = date.parseISO(rawInput);
  if (input.toString() === "Invalid Date") {
    throw new Error(`Invalid date: ${rawInput}`);
  }
  return input;
}

export const toUnixTimestamp: Plugin = (rawInput: string) => {
  const input = parseDateInput(rawInput);
  return date.getUnixTime(input).toString();
};
export const toISODateTime: Plugin = (rawInput: string) => {
  const input = parseDateInput(rawInput);
  return date.formatISO(input);
};

export const addTime: HigherOrderPlugin = (
  rawAmount: string,
  rawUnit: string
) => {
  return (rawInput: string) => {
    const amount = parseInt(rawAmount);
    const input = parseDateInput(rawInput);
    const unit = parseDateUnit(rawUnit);
    return date.formatISO(date.add(input, { [unit]: amount }));
  };
};

export const subtractTime: HigherOrderPlugin = (
  rawAmount: string,
  rawUnit: string
) => {
  const amount = parseInt(rawAmount);
  return addTime((-1 * amount).toString(), rawUnit);
};

export const formatDateTime: HigherOrderPlugin =
  (...format: string[]) =>
  (rawInput: string) => {
    const input = parseDateInput(rawInput);
    return date.format(input, format.join(" "));
  };

export const DATE_PLUGINS = {
  toUnixTimestamp,
  toISODateTime,
  addTime,
  subtractTime,
  formatDateTime,
};
