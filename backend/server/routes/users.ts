import { Router } from "express";
import { prisma } from "../prisma";

export const usersRouter = Router();

usersRouter.post("/", async (req, res) => {
  try {
    const { email, name } = req.body;
    const user = await prisma.user.create({ data: { email, name } });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

usersRouter.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});
