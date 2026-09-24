import express from "express";
import { prisma } from "../prisma";
import bcrypt from "bcryptjs";


const router = express.Router();

router.post("/register", async (req, res) => {
    try {
      const { name, email, pwdHash } = req.body;
      //console.log(name, email); TODO: remove debug logging for final deployment
      console.log("this is the register route");
      //check if user already exists
      const userExists = await prisma.user.findUnique( { where: { email: email } } );
      if (userExists) {
        return res.status(409).json({ status: "Conflict", error: "User already exists, email must be unique" });
      }

      //hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(pwdHash, salt);

      //create user
      const user = await prisma.user.create({
        data: { name, email, pwdHash: hashedPassword},
      });
      res.status(201).json({ status: "Success", data: user });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

export default router;