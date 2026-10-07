import { Request, Response } from "express";
import generateToken from "../utils/generateToken";
import * as authService from "../services/authService";
import {
  loginUserSchema,
  registerUserSchema,
} from "@flock/shared/schemas/auth";
import { validate } from "../utils/validate";

export async function register(req: Request, res: Response) {
  const registerRequest = validate(
    registerUserSchema,
    req.body,
    "Invalid request body",
  );

  const user = await authService.registerUser(registerRequest);

  //generate token
  const token = generateToken(user.id, res);

  // Don't return the password hash to the client
  const { pwdHash: _, ...safeUser } = user;
  res.status(201).json({ status: "Success", data: { safeUser, token } });
}

export async function login(req: Request, res: Response) {
  const loginRequest = validate(
    loginUserSchema,
    req.body,
    "Invalid request body",
  );
  const user = await authService.loginUser(loginRequest);

  //generate token
  const token = generateToken(user.id, res);
  const { pwdHash: _, ...safeUser } = user;

  res.status(200).json({ status: "Success", data: { user: safeUser, token } });
}

export function logout(req: Request, res: Response) {
  //logging out = removing the token from the user's cookie
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
  });
  res
    .status(200)
    .json({ status: "Success", data: { message: "Logged out successfully" } });
}
