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


// add user to database
usersRouter.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;
    console.log(name, email);
    const user = await prisma.user.create({
      data: { name, email },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});