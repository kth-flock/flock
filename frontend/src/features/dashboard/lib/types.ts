import type { PublicUser } from "@/shared/types/user";
import type { EventDetails, Rsvp } from "@/features/event/lib/types";

// TODO: Add notif endpoint fron backend

type NotificationBase = {
  id: number;
  from: PublicUser;
  createdAt: string;
};

type NotificationEvent = Pick<EventDetails, "id" | "title">;

export type DashboardNotification = NotificationBase &
  (
    | { type: "req" }
    | { type: "invite"; event: NotificationEvent }
    | {
        type: "RSVP";
        event: NotificationEvent;
        RSVPstatus: Exclude<Rsvp, "PENDING">;
      }
  );
