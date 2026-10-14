import type { PublicUser } from "@/shared/types/user";
import type { Event } from "@prisma/types";

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

// Shapes returned by GET /events/:eventId (dates arrive as ISO strings)
export type EventDetails = Omit<Event, "startsAt" | "endsAt"> & {
  startsAt: string;
  endsAt: string | null;
  createdBy: PublicUser;
  announcements: EventAnnouncement[];
};

// Shape returned by GET /events/createdBy/:userId
export type EventSummary = Event;

// Shape returned by GET /events/invited/:userId
export type InvitedEvent = Event & { createdBy: PublicUser };

export type { RSVP as Rsvp } from "../../../../../backend/prisma/generated/enums";
