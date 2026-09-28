import { Router } from "express";
import { prisma } from "../prisma";
import { STATUS } from "../../prisma/generated/enums";
import { publicUserInformationSelect } from "../utils/selectors";
import { directionSchema, idSchema } from "../../../shared/schemas/common";
import {
  acceptFriendship,
  getFriendRequests,
  getMyFriends,
  sendFriendRequest,
} from "../controllers/friendshipsController";
import { deleteFriendship } from "../services/friendshipsServices";

export const friendshipsRouter = Router();

// GET ALL my friends
friendshipsRouter.get("/", getMyFriends);

// GET friendship requests, use direction=sent or direction=received to get specific requests
friendshipsRouter.get("/requests", getFriendRequests);

// Send requests
friendshipsRouter.post("/request", sendFriendRequest);
// accept request
friendshipsRouter.patch("/request", acceptFriendship);

// delete friendship
friendshipsRouter.delete("/", deleteFriendship);
