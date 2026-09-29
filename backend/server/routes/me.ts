import { Router } from "express";
import { friendshipsRouter } from "./friendships";
import {
  getMyAccount,
  deleteMyAccount,
  editUserInfo,
} from "../controllers/meController";

export const meRouter = Router();

meRouter.use("/friendships", friendshipsRouter);

meRouter.get("/", getMyAccount); // GET my account
meRouter.delete("/", deleteMyAccount); // DELETE my user a ccount
meRouter.patch("/", editUserInfo); // Edit my user information
