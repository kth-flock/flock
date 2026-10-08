import type { PublicUser } from "@/shared/types/user";

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

export type EventSummary = {
  id: number;
  createdById: number;
  title: string;
  description: string | null;
  locationName: string | null;
  googlePlaceId: string | null;
  startsAt: string;
  endsAt: string | null;
  imageUrl: string | null;
};

export type InvitedEvent = EventSummary & { createdBy: PublicUser };

export type EventDetails = InvitedEvent & {
  announcements: EventAnnouncement[];
};

export type { RSVP as Rsvp } from "../../../../../backend/prisma/generated/enums";
