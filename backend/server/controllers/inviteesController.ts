import { Request, Response } from "express";
import * as inviteesServices from "../services/inviteesService";
import { idSchema } from "@flock/shared/schemas/common";
import { validate } from "../utils/validate";
import { ValidationError } from "../utils/errors";
import { UserId } from "@flock/shared/schemas/user";

export async function addInvitee(req: Request, res: Response) {
  const eventId = validate(idSchema, req.params.eventId, "Invalid event ID");
  const inviteeId = validate(
    idSchema,
    req.params.inviteeId,
    "Invalid invitee ID",
  );
  const userId = validate(idSchema, req.user.id, "Invalid user ID");

  const invite = await inviteesServices.addInvitee(userId, eventId, inviteeId);

  res.status(201).json({
    status: "Success",
    data: invite,
  });
}

export async function addInviteesInBatch(req: Request, res: Response) {
  const eventId = validate(idSchema, req.params.eventId, "Invalid event ID");
  const userId = validate(idSchema, req.user.id, "Invalid user ID");

  if (!Array.isArray(req.body.inviteeIds)) {
    throw new ValidationError("inviteeIds must be an array");
  }

  const inviteeIds: UserId[] = req.body.inviteeIds.map((id: unknown) =>
    validate(idSchema, id, "Invalid invitee ID"),
  );

  const { invitees, skipped } = await inviteesServices.AddInviteesInBatch(
    userId,
    eventId,
    inviteeIds,
  );

  res.status(201).json({
    status: "Success",
    data: { invitees, skipped },
  });
}

export async function removeInvitee(req: Request, res: Response) {
  const eventId = validate(idSchema, req.params.eventId, "Invalid event ID");
  const inviteeId = validate(
    idSchema,
    req.params.inviteeId,
    "Invalid invitee ID",
  );
  const userId = validate(idSchema, req.user.id, "Invalid user ID");

  const invitee = await inviteesServices.removeInvitee(
    userId,
    eventId,
    inviteeId,
  );

  res.status(200).json({
    status: "Success",
    data: invitee,
  });
}
