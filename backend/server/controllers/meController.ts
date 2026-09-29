import { Request, Response } from "express";
import * as meServices from "../services/meServices";
import { getUserById } from "../services/usersServices";
import { idSchema } from "@flock/shared/schemas/common";
import { editUserInfoSchema } from "@flock/shared/schemas/user";

export async function getMyAccount(req: Request, res: Response) {
  const account = await meServices.getMyAccount(req.user.id);

  if (!account) {
    return res.status(404).json({ status: "Error", error: "User not found" });
  }

  res.status(200).json({ status: "Success", data: account });
}

export async function deleteMyAccount(req: Request, res: Response) {
  const result = idSchema.safeParse(req.user.id);
  if (!result.success) {
    return res.status(400).json({
      error: "Invalid user ID",
    });
  }
  const id = result.data;

  const user = await getUserById(id);

  if (!user) {
    return res.status(404).json({ status: "Error", error: "User not found" });
  }

  await meServices.deleteMyAccount(id);

  res.status(200).json({ status: "Success", message: "User deleted" });
}

export async function editUserInfo(req: Request, res: Response) {
  const result = idSchema.safeParse(req.user.id);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid user ID",
    });
  }
  const id = result.data;

  const existingUser = await getUserById(id);
  if (!existingUser) {
    return res.status(404).json({ status: "Error", error: "User not found" });
  }

  const editData = editUserInfoSchema.safeParse(req.body);

  if (!editData.success) {
    return res.status(400).json({
      error: "Invalid request body",
    });
  }

  const updatedUser = await meServices.editUserInfo(id, editData.data);

  res.status(200).json({
    status: "Success",
    message: "User information successfully edited",
    data: updatedUser,
  });
}
