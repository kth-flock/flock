import { Response } from "express";
import { ZodError } from "zod";

export function handleZodError(
  error: unknown,
  res: Response,
  message: string = "Invalid request body",
) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      status: "Error",
      error: message,
    });
  }
}
