import { Request, Response } from "express";
import { prisma } from "../prisma";

export async function invite( req : Request, res: Response){
    // we need to invite someone: 
    // need: invitee id, event id (recieve from params?), host id

    //verify invitee id exists in prisma as a member
    //verify event id exists in prisma
    //we can use the where: {eventId_userId} bc they are unique

    const invite = await prisma.Invitee.create{

    }



    //check if already invited? maybe not needed

    //add an entry in prisma
    //Set default status to pending

    // restrictions:
    //only host can do this, if eventID.hostid == userid



}


export async function removeInvitee( req : Request, res: Response){

}