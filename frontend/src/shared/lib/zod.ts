import type { ZodError } from "zod";

export function zodErrorsToRecord(error: ZodError) {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    errors[issue.path.join(".") || "form"] ??= issue.message;
  }
  return errors;
}
