import express from "express";
import { prisma } from "../prisma";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken";

const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, pwdHash } = req.body;

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res
        .status(409)
        .json({ status: "Conflict", error: "User already exists, email must be unique" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(pwdHash, salt);

    const user = await prisma.user.create({
      data: { firstName, lastName, email, pwdHash: hashedPassword },
    });

    // Don't return the password hash to the client
    const { pwdHash: _, ...safeUser } = user;
    res.status(201).json({ status: "Success", data: safeUser });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, pwdHash } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.pwdHash) {
      return res
        .status(401)
        .json({ status: "Unauthorized", error: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(pwdHash, user.pwdHash);
    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ status: "Unauthorized", error: "Invalid credentials" });
    }

    const token = generateToken(user.id);
    const { pwdHash: _, ...safeUser } = user;

    res.status(200).json({ status: "Success", data: { user: safeUser, token } });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default authRouter;
