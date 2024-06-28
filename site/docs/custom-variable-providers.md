---
sidebar_position: 4
---

# Custom Variable Providers

You can use a plain object like `{ "key": "value" }`, or a `new Map()` instance
to pass variables into `format`. You are not limited by that though!

If you'd like to pass other types of values into the template, you can create
your own variable provider. The only requirement is that you have a `get` method
which accepts a variable name, and returns the value corresponding to that
variable as a string.

```ts
import fs from "fs";

class FileProvider {
  public get(key: string) {
    return fs.readFileSync(key).toString();
  }
}

// This project is built with node 22
format("This project is built with node {{ .nvmrc }}", new FileProvider());
```

You are limited to sync functions. If you need to perform potentially async
operations to get values, consider using
[parseVariablesUsed](https://microfern.bgenc.net/api/functions/parse_variables_used.parseVariablesUsed.html#parseVariablesUsed)
to get the variable names first and gather values in advance.
