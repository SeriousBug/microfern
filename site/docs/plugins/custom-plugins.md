---
sidebar_position: 3
description: Create your own plugins that manipulate variables to use in templates.
---

# Custom Plugins

You are not limited by the plugins microfern ships with! You can add new plugins by
passing new functions to the plugins parameter. Plugins are just functions that
accept a string parameter, and return a string result.

<!-- my-plugin -->

```ts
function myPlugin(input: string): string {
  // Manipulate the string however you want here!
  const words = input.split(" ");
  return words.map((word) => `- ${word}\n`).join("");
}

// Some of my favorite fruits are:
// - apple
// - banana
// - orange
format(
  "Some of my favorite fruits are:\n{{ fruits | myPlugin }}",
  { fruits: "apple banana orange" },
  { plugins: { myPlugin } }
);

// Your plugins can also accept options!
function pluginWithOptions(repeat: string, separator: string) {
  // These higher order plugins take the options, then return
  // a regular plugin function. The wrapped function can access
  // the parameters from the top level.
  return (input: string) => {
    // All the options have to be strings. You can then parse
    // them into whatever type you need, like this example does
    // with `repeat`.
    return new Array(Number.parseInt(repeat)).fill(input).join(separator);
  };
}

// ba-na-na-na
format(
  "ba-{{ val | pluginWithOptions 3 - }}",
  { val: "na" },
  { plugins: { pluginWithOptions } }
);
```

The name used to use the plugin inside the template block is determined by the
name you use for it in the map. So you can always rename them by using a
different name:

<!-- new-plugin -->

```ts
// I also like
// - broccoli
// - carrot
// - potato
format(
  "I also like\n{{ vegetables | newPlugin }}",
  { vegetables: "broccoli carrot potato" },
  { plugins: { newPlugin: myPlugin } }
);
```

You can use your custom plugins alongside the default plugins by combining the
plugins map.

<!-- combined -->

```ts
// I love these so much I have to scream!
// - COOKIES
// - CAKE
// - CHOCOLATE
format(
  "I love these so much I have to scream!\n{{ favorites | uppercase | myPlugin }}",
  { favorites: "cookies cake chocolate" },
  { plugins: { ...DEFAULT_PLUGINS, myPlugin } }
);
```
