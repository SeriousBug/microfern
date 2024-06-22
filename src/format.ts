type ReadonlyMap<K, V> = {
  get(key: K): V | undefined;
};

function isReadonlyMap<K, V>(map: unknown): map is ReadonlyMap<K, V> {
  return (
    typeof map === "object" &&
    map !== null &&
    "get" in map &&
    typeof map["get"] === "function"
  );
}

export function format(
  /** The template to be formatted. */
  template: string,
  /** The values to substitute for the placeholder variables in the template.
   *
   * If a variable is not found in the map, it will be replaced with
   * `missingVariableDefault` if provided. Otherwise, it will be replaced with
   * 'undefined'.
   *
   * You can use a `Map`, a plain object, or your own custom map implementation
   * as long as it has a `get` method.
   */
  variables:
    | Readonly<Record<string, string | number>>
    | ReadonlyMap<string, string | number>,
  options?: {
    missingVariableDefault?: string | number;
  }
): string {
  const output: string[] = [];

  const getValue = isReadonlyMap(variables)
    ? (name: string) => variables.get(name)
    : (name: string) => variables[name];

  let state: "comment" | "placeholder" | "text" | "escape" = "text";

  template.split(/(?=\\|[{][{]|[{]#|[}][}]|#[}])/).forEach((part) => {
    // This is a basic state machine to parse the template and process it.

    if (state === "escape") {
      output.push(part);
      state = "text";
      return;
    }

    const symbol = part.slice(0, 2);

    switch (symbol) {
      case "\\":
        if (state === "placeholder" || state === "comment") {
          throw new Error(
            "Invalid template: unexpected escape \\, you can not escape inside a {{ }} template or comment blocks"
          );
        }
        state = "escape";
        return;
      case "{#":
        if (state !== "text") {
          throw new Error("Invalid template: unexpected {#");
        }
        state = "comment";
        return;
      case "#}":
        if (state !== "comment") {
          throw new Error(
            "Invalid template: encountered #} that does not match any opening {#"
          );
        }
        // Anything after the closing symbol is text
        state = "text";
        output.push(part.slice(2));
        break;
      case "{{": {
        // variable to replace
        if (state === "comment") return;
        if (state === "placeholder") {
          throw new Error("Invalid template: {{ }} blocks can not be nested");
        }
        state = "placeholder";
        const name = part.slice(2).trim();
        if (name.length === 0) {
          throw new Error("Invalid template: encountered empty {{ }} block.");
        }
        const value = getValue(name) ?? options?.missingVariableDefault;
        output.push(String(value));
        return;
      }
      case "}}": {
        if (state === "comment") return;
        if (state !== "placeholder") {
          throw new Error(
            "Invalid template: encountered }} that does not match any opening {{"
          );
        }
        // Anything after the closing symbol is text
        state = "text";
        output.push(part.slice(2));
        break;
      }
      default:
        output.push(part);
        break;
    }
  });

  if (state !== "text") {
    throw new Error("Invalid template: unclosed comment or block");
  }

  return output.join("");
}
