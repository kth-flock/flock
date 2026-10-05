import { z } from "zod";
import { ValidationError } from "./errors";

export function validate<T>(
  schema: z.ZodType<T>,
  data: unknown,
  message = "Invalid data",
): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new ValidationError(message);
  }

  return result.data;
}
