import express from "express";
import { prisma } from "../prisma";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken";


const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
    try {
      const { email, pwdHash } = req.body;
      console.log("this is the login route");

    //check if user email exists
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !user.pwdHash) {
        return res.status(401).json({ status: "Unauthorized", error: "Invalid credentials" });
      }

      //check if password is correct
      const isPasswordCorrect = await bcrypt.compare(pwdHash, user.pwdHash);
      if (!isPasswordCorrect) {
        return res.status(401).json({ status: "Unauthorized", error: "Invalid credentials" });
      }
      //generate token
      const token = generateToken(user.id);

      res.status(200).json({ status: "Success", data: user });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
});



export default authRouter;