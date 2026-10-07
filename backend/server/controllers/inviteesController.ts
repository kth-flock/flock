import { Request, Response } from "express";
import { prisma } from "../prisma";
import * as inviteesServices from "../services/inviteesService";
import { idSchema } from "@flock/shared/schemas/common";

export async function addInvitee( req : Request, res: Response){

    try {    

        const eventId = req.params.eventId;
        const inviteeId = req.params.inviteeId;

        const eventIdResult = idSchema.safeParse(eventId); 
        const inviteeIdResult = idSchema.safeParse(inviteeId); 


        if (!eventIdResult.success || !inviteeIdResult.success) {
            return res.status(400).json({
                error: "Invalid event or invitee ID",
            });
        }

        const invite = await inviteesServices.addInvitee(req.user.id, eventIdResult.data, inviteeIdResult.data);
        res.status(201).json({
            status: "Success",
            data: invite,
        });
    } 
    catch (error) {
        if (error instanceof inviteesServices.NotAuthorizedError) {
            return res.status(403).json({
                error: "Only event host can invite users",
            });
        }
        if (error instanceof inviteesServices.EventNotFoundError) {
            return res.status(404).json({
                error: "Event not found",
            });
        }
        if (error instanceof inviteesServices.InviteeNotFoundError) {
            return res.status(404).json({
                error: "Invitee not found",
            });
        }
        if (error instanceof inviteesServices.InviteeAlreadyInvitedError) {
            return res.status(400).json({
                error: "User already invited to event",
            });
        }

        throw error;
    }
}



export async function removeInvitee( req : Request, res: Response){

}