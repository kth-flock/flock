export const DATE_ERROR_KEYS: Record<string, string> = {
  startsAt: "startDate",
  endsAt: "endDate",
};

export function getFieldErrors(
  issues: { path: PropertyKey[]; message: string }[],
): Record<string, string> {
  return issues.reduce<Record<string, string>>((errors, issue) => {
    const field =
      DATE_ERROR_KEYS[String(issue.path[0])] ??
      (issue.path.join(".") || "form");
    errors[field] ??= issue.message;
    return errors;
  }, {});
}
