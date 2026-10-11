import { NextFunction, Response, Request } from "express";
import multer from "multer";
import { ZodError } from "zod";

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ status: "Error", error: error.message });
  }

  console.log(error);
  res.status(500).json({ status: "Error", error: "Internal server error" });
}
