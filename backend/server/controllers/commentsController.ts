import { Request, Response } from "express";
import * as commentsService from "../services/commentsService";
import { idSchema } from "@flock/shared/schemas/common";
import {
  createCommentSchema,
  updateCommentSchema,
} from "@flock/shared/schemas/comment";
import { validate } from "../utils/validate";

export async function addComment(req: Request, res: Response) {
  const eventId = validate(idSchema, req.params.eventId, "Invalid event ID");
  const announcementId = validate(
    idSchema,
    req.params.announcementId,
    "Invalid announcement ID",
  );
  const userId = validate(idSchema, req.user.id, "Invalid user ID");
  const commentData = validate(
    createCommentSchema,
    req.body,
    "Invalid comment data",
  );

  const comment = await commentsService.addComment(
    eventId,
    announcementId,
    userId,
    commentData,
  );

  res.status(201).json({ status: "Success", data: comment });
}

export async function updateComment(req: Request, res: Response) {
  const eventId = validate(idSchema, req.params.eventId, "Invalid event ID");
  const announcementId = validate(
    idSchema,
    req.params.announcementId,
    "Invalid announcement ID",
  );
  const commentId = validate(
    idSchema,
    req.params.commentId,
    "Invalid comment ID",
  );
  const userId = validate(idSchema, req.user.id, "Invalid user ID");
  const commentData = validate(
    updateCommentSchema,
    req.body,
    "Invalid comment data",
  );

  const comment = await commentsService.updateComment(
    eventId,
    announcementId,
    commentId,
    userId,
    commentData,
  );

  res.status(200).json({ status: "Success", data: comment });
}

export async function deleteComment(req: Request, res: Response) {
  const eventId = validate(idSchema, req.params.eventId, "Invalid event ID");
  const announcementId = validate(
    idSchema,
    req.params.announcementId,
    "Invalid announcement ID",
  );
  const commentId = validate(
    idSchema,
    req.params.commentId,
    "Invalid comment ID",
  );
  const userId = validate(idSchema, req.user.id, "Invalid user ID");

  await commentsService.deleteComment(
    eventId,
    announcementId,
    commentId,
    userId,
  );

  res.status(204).send();
}
