import { Prisma } from "@prisma/types";

export type ExtendedEvent = Prisma.EventGetPayload<{
  include: {
    createdBy: true;
    invitees: { include: { user: true } };
    announcements: {
      include: { user: true; comments: { include: { user: true } } };
    };
  };
}>;

export type ExtendedAnnouncment = Prisma.AnnouncementGetPayload<{
  include: { user: true; comments: { include: { user: true } } };
}>;
