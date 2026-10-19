import { Router } from "express";
import {
  addComment,
  updateComment,
  deleteComment,
} from "../controllers/commentsController";

export const commentsRouter = Router({ mergeParams: true });

commentsRouter.post("/", addComment);
commentsRouter.patch("/:commentId", updateComment);
commentsRouter.delete("/:commentId", deleteComment);
