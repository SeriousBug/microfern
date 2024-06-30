---
sidebar_position: 1
---

# Get Started

## Install

### npm

Install it [from npm](https://www.npmjs.com/package/microfern).

```sh
npm install microfern
# or
yarn add microfern
# or
pnpm add microfern
# or
bun add microfern
```

### CDN

You can import the package through a CDN if you prefer. This is [supported in most browsers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#javascript.statements.import),
but not in Node.js (as of Node 22, it's behind the `--experimental-network-imports` flag).

```js
import { format } from "https://unpkg.com/microfern@0.2.1/dist/microfern.js";
```

## Usage

Import and call the function `format`.

<!-- If you change these examples, please update the corresponding test in doc.test.ts too! -->

<!-- simple -->

```ts
import { format } from "microfern";

// microfern templates look like this
format("{{ project }} templates look like this", { project: "microfern" });
```

### Variables

You can provide the variables in a plain object like the examples above, or a
`Map`, or your own [custom variable provider](/docs/custom-variable-providers).

```ts
// You can use a Map object to provide variables.
format(
  "You can use a {{ provider }} to provide variables.",
  new Map([["provider", "Map object"]])
);
```

Variable keys and values should be strings. You can use other types as values,
but they will be stringified with a `String()` call. This is okay for types like
numbers or booleans, but you'll likely want to format the values yourself to
make sure they appear how you want them to.

### Plugins

There are also a set of default plugins which you can import. Plugins allow you
to transform values in templates. This import is separate from the format in
case you don't need or want them, so they don't get included in your bundle.

<!-- plugins -->

```ts
import { format } from "microfern";
import { DEFAULT_PLUGINS } from "microfern/plugins";

// DEFAULT_PLUGINS contains useful functions!
format(
  "{{ name | uppercase | snakeCase }} contains useful functions!",
  { name: "default plugins" },
  { plugins: DEFAULT_PLUGINS }
);
```

### Always Using the Same Plugins or Variables

If you have a set of plugins or variables that you'd like to always use,
you can do so by wrapping the `format` function. For example:

```ts
import { format as baseFormat } from "microfern";
import { DEFAULT_PLUGINS } from "microfern/plugins";

const variables = {
  fruit: "cherry",
  vegetable: "okra",
} as const;

export function format(template: string) {
  return baseFormat(template, variables, { plugins: DEFAULT_PLUGINS });
}
```

You'll then be able to import and use your own wrapped function whenever you
need to format something, and have all the variables and plugins will always be
available.
