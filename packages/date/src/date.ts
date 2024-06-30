import type { Plugin, HigherOrderPlugin } from "microfern";
import { fromUnixTime } from "date-fns/fromUnixTime";
import { parseISO } from "date-fns/parseISO";
import { getUnixTime } from "date-fns/getUnixTime";
import { formatISO } from "date-fns/formatISO";
import { add } from "date-fns/add";
import { format } from "date-fns/format";
import type { Duration } from "date-fns";

function parseInt(input: string): number {
  const parsed = Number.parseInt(input, 10);
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid integer: ${input}`);
  }
  return parsed;
}

type DateUnit = keyof Duration;
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
    return fromUnixTime(parseInt(rawInput));
  }

  let input = parseISO(rawInput);
  if (!isNaN(input.getTime())) {
    return input;
  }

  input = new Date(rawInput);
  if (!isNaN(input.getTime())) {
    return input;
  }

  throw new Error(`Invalid date: ${rawInput}`);
}

export const toUnixTimestamp: Plugin = (rawInput: string) => {
  const input = parseDateInput(rawInput);
  return getUnixTime(input).toString();
};

export const toISODateTime: Plugin = (rawInput: string) => {
  const input = parseDateInput(rawInput);
  return formatISO(input);
};

export const addTime: HigherOrderPlugin = (
  rawAmount: string,
  rawUnit: string
) => {
  return (rawInput: string) => {
    const amount = parseInt(rawAmount);
    const input = parseDateInput(rawInput);
    const unit = parseDateUnit(rawUnit);
    return formatISO(add(input, { [unit]: amount }));
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
  (...formatString: string[]) =>
  (rawInput: string) => {
    const input = parseDateInput(rawInput);
    return format(input, formatString.join(" "));
  };

export const DATE_PLUGINS = {
  toUnixTimestamp,
  toISODateTime,
  addTime,
  subtractTime,
  formatDateTime,
};
