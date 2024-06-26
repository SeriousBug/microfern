/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
  entryPoints: [
    "./src/microfern.ts",
    "./src/plugins/base.ts",
    "./src/parse-variables-used.ts",
  ],
  out: "site/build/api",
};
