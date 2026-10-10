import { Router } from "express";
import { friendshipsRouter } from "./friendships";
import { notificationsRouter } from "./notifications";
import {
  getMyAccount,
  deleteMyAccount,
  editUserInfo,
} from "../controllers/meController";
import { authMiddleware } from "../middleware/authMiddleware";

export const meRouter = Router();

meRouter.use("/friendships", friendshipsRouter);
meRouter.use("/notifications", notificationsRouter);

meRouter.get("/", getMyAccount); // GET my account
meRouter.delete("/", deleteMyAccount); // DELETE my user a ccount
meRouter.patch("/", editUserInfo); // Edit my user information
