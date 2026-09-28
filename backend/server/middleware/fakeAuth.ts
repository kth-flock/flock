// middleware/fakeAuth.ts
import { Request, Response, NextFunction } from "express";

export function fakeAuth(req: Request, res: Response, next: NextFunction) {
  const id = Number(req.headers["x-user-id"]);

  if (!id) {
    return res
      .status(401)
      .json({ status: "Error", error: "Missing x-user-id header" });
  }

  req.user = { id };
  next();
}
