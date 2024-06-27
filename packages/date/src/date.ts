import type { Plugin } from "microfern";
import * as date from "date-fns";

export const toUnixTimestamp: Plugin = (input: string) =>
  date.getUnixTime(date.parseISO(input)).toString();

export const fromUnixTimestamp: Plugin = (input: string) =>
  date.formatISO(date.fromUnixTime(parseInt(input)));

export const DATE_PLUGINS = {
  toUnixTimestamp,
  fromUnixTimestamp,
};
