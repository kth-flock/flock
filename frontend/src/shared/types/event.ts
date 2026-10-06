import { Prisma } from "@prisma/types";

export type ExtendedEvent = Prisma.EventGetPayload<{
  include: {
    createdBy: true;
    announcements: true;
  };
}>;
