import type { PublicUser } from "@/shared/types/user";

// Shapes returned by GET /events/:eventId (dates arrive as ISO strings)

export type EventComment = {
  id: number;
  announcementId: number;
  userId: number;
  content: string;
  createdAt: string;
  user: PublicUser;
};

export type EventAnnouncement = {
  id: number;
  eventId: number;
  userId: number;
  content: string;
  createdAt: string;
  user: PublicUser;
  comments: EventComment[];
};

export type { RSVP as Rsvp } from "../../../../../backend/prisma/generated/enums";
