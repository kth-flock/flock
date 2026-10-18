import type { PublicUser } from "@/shared/types/user";
import type { Event } from "@prisma/types";
import type { RSVP as Rsvp } from "../../../../../backend/prisma/generated/enums";

export type EventSummary = Event;

export type InvitedEvent = Event & {
  createdBy: PublicUser;
  invitees: { rsvp: Rsvp }[];
};

export type { RSVP as Rsvp } from "../../../../../backend/prisma/generated/enums";
