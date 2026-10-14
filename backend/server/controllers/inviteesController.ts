import { Request, Response } from "express";
import * as inviteesServices from "../services/inviteesService";
import { idSchema } from "@flock/shared/schemas/common";
import { validate } from "../utils/validate";

export async function addInvitee(req: Request, res: Response) {
  const eventId = validate(idSchema, req.params.eventId, "Invalid event ID");
  const inviteeId = validate(
    idSchema,
    req.params.inviteeId,
    "Invalid invitee ID",
  );
  const userId = validate(idSchema, req.user.id, "Invalid user ID");

  const invite = await inviteesServices.addInvitee(
    userId,
    eventId,
    inviteeId,
  );

  res.status(201).json({
    status: "Success",
    data: invite,
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
