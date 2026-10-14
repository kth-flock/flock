import { LoginUser, RegisterUser } from "@flock/shared/schemas/auth";
import { prisma } from "../prisma";
import bcrypt from "bcryptjs";
import { ValidationError, InvalidCredentialsError } from "../utils/errors";

export async function registerUser(userData: RegisterUser) {
  const { firstName, lastName, email, password } = userData;

  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) {
    throw new ValidationError("Could not create account"); //Intentionally vague error message to prevent enumeration attacks
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  //create user in database
  const user = await prisma.user.create({
    data: { firstName, lastName, email, pwdHash: encryptedPassword },
  });

  return user;
}

export async function loginUser(userInput: LoginUser) {
  const { email, password } = userInput;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.pwdHash) {
    //user not found
    throw new InvalidCredentialsError("Invalid credentials");
  }

  //compare hashed password
  const isPasswordCorrect = await bcrypt.compare(password, user.pwdHash);
  if (!isPasswordCorrect) {
    //incorrect password
    throw new InvalidCredentialsError("Invalid credentials");
  }

  return user;
}
