import { idSchema } from "../../../shared/schemas/common";
import { prisma } from "../prisma";
import { z } from "zod";

type UserId = z.infer<typeof idSchema>;

// User validation
export async function getUserById(id: UserId) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      imageUrl: true,
    },
  });
  return user;
}
