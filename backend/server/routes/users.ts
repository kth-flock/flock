import { Router } from "express";
import { prisma } from "../prisma";

export const usersRouter = Router();

usersRouter.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});
