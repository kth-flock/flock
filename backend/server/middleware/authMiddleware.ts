import jwt, { type JwtPayload} from "jsonwebtoken";
import { prisma } from "../prisma";
import { Request, Response, NextFunction } from "express";


export const authMiddleware = async(req: Request, res: Response, next: NextFunction) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) { //TODO: can perhaps be removed if we only use cookies
        token = req.headers.authorization.split(" ")[1];
    }
    else if (req.cookies?.token) {
        token = req.cookies.token;
    }

    if(!token) {
        return res.status(401).json({ status: "Unauthorized", error: "Session token was not provided" });
    }

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
        return res.status(500).json({ status: "Error", error: "JWT_SECRET is not set" });
        }

        //verify the token and extract the user id from it
        const decoded = jwt.verify(token, secret );

        if (typeof decoded === "string" || typeof decoded.id !== "number") {
            return res.status(401).json({ status: "Unauthorized", error: "Invalid token" });
          }

        const user = await prisma.user.findUnique({ where: { id: decoded.id  }, }); //TODO: use one of the services? eg. getUserById /usersServices.ts or /meServices.ts, or just keep this one?
        if(!user) {
            return res.status(401).json({ status: "Unauthorized", error: "User no longer exists" });
        }

        req.user = {id: user.id};
        
    next();
    }
    catch (error) {
        return res.status(401).json({ status: "Unauthorized", error: "Invalid token" });
    }

}