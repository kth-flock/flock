import {Request, Response} from "express";
import generateToken from "../utils/generateToken";
import * as authService from "../services/authService";

export async function register(req: Request, res: Response) {
  try {
    const user = await authService.registerUser(req.body);

    // Don't return the password hash to the client
    const { pwdHash: _, ...safeUser } = user;
    res.status(201).json({ status: "Success", data: safeUser });
  } catch (error) {
    if (error instanceof authService.DuplicateEmailError) {
      return res.status(409).json({ status: "Error", error: "User already exists, email must be unique" });
    }
    res.status(500).json({ error: (error as Error).message });
  }
}

export async function login(req: Request, res: Response) {
  try {
   
    const user = await authService.loginUser(req.body);
    //generate token
    const token = generateToken(user.id, res);
    const { pwdHash: _, ...safeUser } = user; 

    res.status(200).json({ status: "Success", data: { user: safeUser, token } });
  } catch (error) {
    if (error instanceof authService.InvalidCredentialsError) {
      return res.status(401).json({ status: "Error", error: "Invalid credentials" });
    }
    res.status(500).json({ error: (error as Error).message });
  }
}

export async function logout(req: Request, res: Response) {
  
  //logging out = removing the token from the user's cookie
  res.cookie("token", "", {httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", expires: new Date(0)})
  res.status(200).json({ status: "Success", data: { message: "Logged out successfully" } });
 
}

