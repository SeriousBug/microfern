import type { Plugin } from "../format";

export const uppercase: Plugin = (text) => text.toUpperCase();
export const lowercase: Plugin = (text) => text.toLowerCase();
export const capitalize: Plugin = (text) =>
  text[0].toUpperCase() + text.slice(1);
export const titleCase: Plugin = (text) =>
  text
    .split(/\s+/)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
export const snakeCase: Plugin = (text) => text.replace(/\s+/g, "_");
export const kebabCase: Plugin = (text) => text.replace(/\s+/g, "-");
export const camelCase: Plugin = (text) =>
  text
    .split(/\s+/)
    .map((word, index) =>
      index === 0 ? word : word[0].toUpperCase() + word.slice(1)
    )
    .join("");
export const pascalCase: Plugin = (text) =>
  text
    .split(/\s+/)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join("");
export const trim: Plugin = (text) => text.trim();
export const trimStart: Plugin = (text) => text.trimStart();
export const trimEnd: Plugin = (text) => text.trimEnd();
export const urlEscape: Plugin = (text) => encodeURIComponent(text);
export const urlUnescape: Plugin = (text) => decodeURIComponent(text);
export const reverse: Plugin = (text) => text.split("").reverse().join("");
export const escapeHtml: Plugin = (text) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
export const unescapeHtml: Plugin = (text) =>
  text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
export const stripHtml: Plugin = (text) => text.replace(/<[^>]*>/g, "");

export const DEFAULT_PLUGINS = {
  uppercase,
  lowercase,
  capitalize,
  titleCase,
  snakeCase,
  kebabCase,
  camelCase,
  pascalCase,
  trim,
  trimStart,
  trimEnd,
  urlEscape,
  urlUnescape,
  reverse,
  escapeHtml,
  unescapeHtml,
  stripHtml,
};
