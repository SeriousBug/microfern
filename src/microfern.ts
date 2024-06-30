/** A subset of a ReadonlyMap, a variable provider gives the formatter the
 * values to substitute in the template.
 */
export type VariableProvider<K, V> = {
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
 * Hello, {{ username | uppercase }}
 * ```
 *
 * This gets the `username` variable, and passes it through the `uppercase`
 * plugin to process it. That plugin would just look like this:
 *
 * ```ts
 * function uppercase(text: string): string {
 *   return text.toUpperCase();
 * }
 * ```
 *
 * Plugins are simple functions that accept, potentially modify, and return a
 * string. You can create your own plugins to give template authors more
 * options.
 */
export type Plugin = (text: string) => string;
/** You can also have plugins that accept options. For example:
 *
 * ```
 * Hello, {{ username | truncate 10 }}
 * ```
 *
 * Similar to the previous example, this plugin gets the `username` variable,
 * then passes it through the `truncate` plugin. But this time, the plugin will
 * receive a second parameter with the string "10". The plugin would look like
 * this:
 *
 * ```ts
 * function truncate(length: string) {
 *   return (text: string) => text.slice(0, parseInt(length));
 * }
 * ```
 *
 * These are called higher order plugins. Higher order plugins must accept at
 * least 1 option, but may accept more.
 */
export type HigherOrderPlugin = (
  ...opts: [string, ...string[]]
) => (text: string) => string;
export type AnyPlugin = Plugin | HigherOrderPlugin;

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
    plugins?: { [name: string]: AnyPlugin };
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
        const [variableName, ...pluginNamesOpts] = block
          .split("|")
          .map((s) => s.trim());
        const plugins = pluginNamesOpts.map((pluginNameOpts) => {
          const [pluginName, ...pluginOpts] = pluginNameOpts.split(/\s+/);
          const plugin = options?.plugins?.[pluginName];
          if (!plugin) {
            throw new Error(
              'Invalid template: unknown plugin "' + pluginName + '"'
            );
          }
          if (pluginOpts.length > 0) {
            // @ts-ignore TypeScript doesn't like the mixed types here, but what
            // we're doing is safe. A function that accepts a single string will
            // also accept an array of string (and ignore the rest of the
            // arguments). We'll then see that what was returned was not a
            // function and throw an error.
            const derivedPlugin = plugin(...pluginOpts);
            if (typeof derivedPlugin !== "function") {
              throw new Error(
                'Invalid template: plugin "' +
                  pluginName +
                  '" does not accept options'
              );
            }
            return derivedPlugin;
          }
          return plugin;
        });

        const value = plugins.reduce((value, plugin) => {
          const result = plugin(value);
          if (typeof result === "function") {
            throw new Error(
              `Invalid template: plugin "${plugin.name}" requires options, but none were given.`
            );
          }
          return result;
        }, String(getValue(variableName) ?? options?.missingVariableDefault));

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
