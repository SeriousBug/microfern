import type { Plugin } from "microfern";
import * as date from "date-fns";

export const toUnixTimestamp: Plugin = (input: string) => {
  const parsedDate = date.parseISO(input);
  if (parsedDate.toString() === "Invalid Date") {
    throw new Error(`Invalid date: ${input}`);
  }
  return date.getUnixTime(parsedDate).toString();
};
export const fromUnixTimestamp: Plugin = (input: string) => {
  const timestamp = parseInt(input);
  if (Number.isNaN(timestamp)) {
    throw new Error(`Invalid timestamp: ${input}`);
  }
  return date.formatISO(date.fromUnixTime(timestamp));
};

export const DATE_PLUGINS = {
  toUnixTimestamp,
  fromUnixTimestamp,
};
