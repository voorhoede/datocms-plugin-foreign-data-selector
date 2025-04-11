import { template } from "lodash";

export default function parseString (string: string, variables: Record<string, string>) {
  const compiled = template(string, { interpolate: /{([\s\S]+?)}/g });
  return compiled(variables);
}
