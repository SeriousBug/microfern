/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
  entryPoints: [
    "./src/microfern.ts",
    "./src/plugins.ts",
    "./src/parse-variables-used.ts",
    "./packages/date/src/date.ts",
  ],
  out: "site/build/api",
};
