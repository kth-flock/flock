import { Router } from "express";
import {
  acceptFriendship,
  getFriendRequests,
  getMyFriends,
  sendFriendRequest,
  deleteFriendship,
} from "../controllers/friendshipsController";

export const friendshipsRouter = Router();

friendshipsRouter.get("/", getMyFriends); // GET ALL my friends
friendshipsRouter.get("/requests", getFriendRequests); // GET friendship requests, use direction=sent or direction=received to get specific request type
friendshipsRouter.post("/request", sendFriendRequest);
friendshipsRouter.patch("/request", acceptFriendship);
friendshipsRouter.delete("/", deleteFriendship);
