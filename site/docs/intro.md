---
sidebar_position: 1
---

# Get Started

## Install

<!--
Install it from npm.


```
npm install microfern
```
-->

## Usage

Import and call the function `format`.

<!-- If you change these examples, please update the corresponding test in doc.test.ts too! -->

<!-- simple -->

```ts
import { format } from "microfern";

// microfern templates look like this
format("{{ project }} templates look like this", { project: "microfern" });
```

There are also a set of default plugins which you can import. Plugins allow you
to transform values in templates. This import is separate from the format in
case you don't need or want them, so they don't get included in your bundle.

<!-- plugins -->

```ts
import { format } from "microfern";
import { DEFAULT_PLUGINS } from "microfern/plugins/base";

// DEFAULT_PLUGINS contains useful functions!
format(
  "{{ name | uppercase | snakeCase }} contains useful functions!",
  { name: "default plugins" },
  { plugins: DEFAULT_PLUGINS }
);
```
