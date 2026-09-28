import { idSchema } from "@flock/shared/schemas/common";
import { STATUS } from "../../prisma/generated/enums";
import { prisma } from "../prisma";

export const publicUserInformationSelect = {
  id: true,
  firstName: true,
  lastName: true,
  imageUrl: true,
};

export const privateUserInformationSelect = {
  ...publicUserInformationSelect,
  email: true,
  createdAt: true,
};
