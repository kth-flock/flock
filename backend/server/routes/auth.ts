import express from "express";
import { register, login, logout } from "../controllers/authController";

export const authRouter = express.Router();

authRouter.post("/register", register); //TODO: register doesn’t auto-login, shall we add auto-login?
authRouter.post("/login", login);
authRouter.post("/logout", logout);
