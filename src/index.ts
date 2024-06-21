export function format(
  template: string,
  variables: Record<string, string | number> | Map<string, string | number>,
  options?: {
    missingVariableDefault?: string | number;
  }
): string {
  const output: string[] = [];

  const getValue =
    variables instanceof Map
      ? (name: string) => variables.get(name)
      : (name: string) => variables[name];

  let state: "comment" | "block" | "text" = "text";

  template.split(/(?=[{][{]|[{]#|[}][}]|#[}])/).forEach((part) => {
    // This is a basic state machine to parse the template and process it.
    const symbol = part.slice(0, 2);
    switch (symbol) {
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
        if (state === "block") {
          throw new Error("Invalid template: {{ }} blocks can not be nested");
        }
        state = "block";
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
        if (state !== "block") {
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

  return output.join("");
}
