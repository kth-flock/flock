import { Router } from "express";
import { friendshipsRouter } from "./friendships";
import { notificationsRouter } from "./notifications";
import {
  getMyAccount,
  deleteMyAccount,
  editUserInfo,
  changeEmail,
  changePassword,
} from "../controllers/meController";

export const meRouter = Router();

meRouter.use("/friendships", friendshipsRouter);
meRouter.use("/notifications", notificationsRouter);

meRouter.get("/", getMyAccount);
meRouter.delete("/", deleteMyAccount);
meRouter.patch("/", editUserInfo);
meRouter.patch("/email", changeEmail);
meRouter.patch("/password", changePassword);
