import type { RsvpStatus } from "@flock/shared/schemas/event";
import type { PublicUser } from "@/shared/types/user";

export type CalendarEvent = {
  id: number;
  title: string;
  startsAt: Date;
  endsAt: Date | null;
  createdById: number;
  createdBy?: PublicUser;
  invitees: { rsvp: RsvpStatus }[];
};

export type CalendarViewProps = {
  today: Date;
  weeks: (Date | null)[][];
  eventsByDay: Map<string, CalendarEvent[]>;
};
