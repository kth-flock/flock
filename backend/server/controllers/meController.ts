import { Request, Response } from "express";
import * as meServices from "../services/meServices";
import { getUserById } from "../services/usersServices";
import { idSchema } from "@flock/shared/schemas/common";
import { editUserInfoSchema } from "@flock/shared/schemas/user";
import { validate } from "../utils/validate";
import { NotFoundError } from "../utils/errors";

export async function getMyAccount(req: Request, res: Response) {
  const userId = validate(idSchema, req.user.id, "Invalid user ID");

  const account = await meServices.getMyAccount(userId);

  if (!account) {
    throw new NotFoundError("User not found");
  }

  res.status(200).json({ status: "Success", data: account });
}

export async function deleteMyAccount(req: Request, res: Response) {
  const id = validate(idSchema, req.user.id, "Invalid user ID");

  const user = await getUserById(id);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  await meServices.deleteMyAccount(id);

  res.status(200).json({ status: "Success", message: "User deleted" });
}

export async function editUserInfo(req: Request, res: Response) {
  const id = validate(idSchema, req.user.id, "Invalid user ID");

  const existingUser = await getUserById(id);
  if (!existingUser) {
    throw new NotFoundError("User not found");
  }

  const editData = validate(
    editUserInfoSchema,
    req.body,
    "Invalid request body",
  );

  const updatedUser = await meServices.editUserInfo(id, editData);

  res.status(200).json({
    status: "Success",
    message: "User information successfully edited",
    data: updatedUser,
  });
}
