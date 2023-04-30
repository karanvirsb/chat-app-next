import { ZodIssue } from "zod";

export function isZodIssues(
  data: unknown
): data is { issues: ZodIssue[]; name: "ZodError" } {
  return data !== null && typeof data === "object" && "issues" in data;
}
