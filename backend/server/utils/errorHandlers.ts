import { NextFunction, Response, Request } from "express";
import { ZodError } from "zod";

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(error);
  res.status(500).json({ status: "Error", error: "Internal server error" });
}
