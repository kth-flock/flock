import { Request, Response } from "express";
import { prisma } from "../prisma";
import { addInviteeSchema } from "@flock/shared/schemas/invitees";
import * as inviteesServices from "../services/inviteesService";

export async function addInvitee( req : Request, res: Response){
    // we need to invite someone: 
    // need: invitee id, event id (recieve from params?), host id

    try {    
        const result = addInviteeSchema.safeParse(req.body); 

        if (!result.success) {
        return res.status(400).json({
            error: "Invalid invitee data",
        });
        }

        if(result.data.inviteeId == req.user.id){
            return res.status(403).json({
                error: "You are not allowed to invite yourself",
            });
        }

        const invite = await inviteesServices.addInvitee(req.user.id, result.data.eventId, result.data.inviteeId);
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