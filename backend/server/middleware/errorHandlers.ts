import { NextFunction, Response, Request } from "express";
import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
  ConflictError,
  InvalidCredentialsError,
} from "../utils/errors";

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(error);
  if (error instanceof ValidationError) {
    return res.status(400).json({
      status: "Error",
      error: error.message,
    });
  }

  if (error instanceof InvalidCredentialsError) {
    return res.status(401).json({
      status: "Error",
      error: error.message,
    });
  }

  if (error instanceof NotFoundError) {
    return res.status(404).json({
      status: "Error",
      error: error.message,
    });
  }

  if (error instanceof ForbiddenError) {
    return res.status(403).json({
      status: "Error",
      error: error.message,
    });
  }

  if (error instanceof ConflictError) {
    return res.status(409).json({
      status: "Error",
      error: error.message,
    });
  }

  return res.status(500).json({
    status: "Error",
    error: "Internal server error",
  });
}
