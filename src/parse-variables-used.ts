import { format } from ".";

/** A mock Map type that collects the keys requested from it. */
class VariableCollector {
  constructor(public variables: string[] = []) {}

  public get(name: string): string {
    this.variables.push(name);
    return "";
  }
}

/** Returns the list of variables used within a template. */
export function parseVariablesUsed(template: string) {
  const collect = new VariableCollector();
  format(template, collect);
  return collect.variables;
}
