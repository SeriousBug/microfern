/** A subset of a ReadonlyMap, a variable provider gives the formatter the
 * values to substitute in the template.
 */
type VariableProvider<K, V> = {
  get(key: K): V | undefined;
};

function isVariableProvider<K, V>(map: unknown): map is VariableProvider<K, V> {
  return (
    typeof map === "object" &&
    map !== null &&
    "get" in map &&
    typeof map["get"] === "function"
  );
}

/** A plugin to transform text.
 *
 * Plugins are used in template blocks to process text. For example:
 *
 * ```
 * Hello, {{ username | capitalize }}
 * ```
 *
 * This gets the `username` variable, and passes it through the `capitalize`
 * plugin to process it.
 *
 * Plugins are simple functions that accept, potentially modify, and return a
 * string. You can create your own plugins to give template authors more
 * options.
 */
export type Plugin = (text: string) => string;

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
    | VariableProvider<string, string | number>,
  options?: {
    missingVariableDefault?: string | number;
    /** A map of plugin names to plugins.
     *
     * Plugins are used in template blocks to process text.
     * Please see {@link Plugin} for more information.
     */
    plugins?: { [name: string]: Plugin };
  }
): string {
  const output: string[] = [];

  const getValue = isVariableProvider(variables)
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
        const block = part.slice(2).trim();
        if (block.length === 0) {
          throw new Error("Invalid template: encountered empty {{ }} block.");
        }
        const [variableName, ...pluginNames] = block
          .split("|")
          .map((s) => s.trim());
        const plugins = pluginNames.map((pluginName) => {
          const plugin = options?.plugins?.[pluginName];
          if (!plugin) {
            throw new Error(
              'Invalid template: unknown plugin "' + pluginName + '"'
            );
          }
          return plugin;
        });

        const value = plugins.reduce(
          (value, plugin) => plugin(value),
          String(getValue(variableName) ?? options?.missingVariableDefault)
        );

        output.push(value);
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
