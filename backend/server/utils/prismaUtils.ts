import { idSchema } from "../../../shared/schemas/common";
import { STATUS } from "../../prisma/generated/enums";
import { prisma } from "../prisma";
import { z } from "zod";

type UserId = z.infer<typeof idSchema>;

// User validation
export async function getUserById(id: UserId) {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return user;
}
