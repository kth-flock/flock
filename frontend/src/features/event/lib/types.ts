import type { PublicUser } from "@/shared/types/user";
import type { Event } from "@prisma/types";
import type { RSVP as Rsvp } from "../../../../../backend/prisma/generated/enums";

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

export type EventDetails = Omit<Event, "startsAt" | "endsAt"> & {
  startsAt: string;
  endsAt: string | null;
  createdBy: PublicUser;
  announcements: EventAnnouncement[];
};

export type EventSummary = Event;

export type InvitedEvent = Event & {
  createdBy: PublicUser;
  invitees: { rsvp: Rsvp }[];
};

export type { RSVP as Rsvp } from "../../../../../backend/prisma/generated/enums";
