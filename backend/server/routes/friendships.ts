import { Router } from "express";
import { prisma } from "../prisma";
import { STATUS } from "../../prisma/generated/enums";
import { publicUserInformationSelect } from "../utils/prismaUtils";
import { handleZodError } from "../utils/errorHandlers";

export const friendshipsRouter = Router();
