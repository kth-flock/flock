import type { Response } from "express";
import jwt, { type SignOptions } from "jsonwebtoken";

const generateToken = (userId: number | string, res: Response) => {
    //userid, then server secret to sign the token
    //this token will be used to authenticate the user on every request
    
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not set");
    }
    const options: SignOptions = {
        expiresIn: (process.env.JWT_EXPIRATION ?? "7d") as SignOptions["expiresIn"],
      };
    const payload = { id: userId };
    const token = jwt.sign(payload, secret, options);

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
    });
    return token;
};

export default generateToken;