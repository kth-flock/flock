import type { RsvpStatus } from "@flock/shared/schemas/event";

export type CalendarEvent = {
  id: number;
  title: string;
  startsAt: Date;
  createdById: number;
  createdBy?: {
    id: number;
    firstName: string;
    lastName: string;
    imageUrl: string | null;
  };
  invitees: { rsvp: RsvpStatus }[];
};

export type CalendarViewProps = {
  year: number;
  month: number;
  today: Date;
  weeks: (Date | null)[][];
  eventsByDay: Map<string, CalendarEvent[]>;
};
