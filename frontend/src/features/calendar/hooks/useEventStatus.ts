import type { CalendarEvent } from "../lib/types";
import { useAuth } from "@/shared/auth/authContext";
import type { RsvpStatus } from "@flock/shared/schemas/event";

export function useEventStatus(event: CalendarEvent) {
  const { user } = useAuth();
  const isHost = event.createdById === user?.id;
  const rsvp = event.invitees?.[0]?.rsvp ?? "PENDING";
  const status: RsvpStatus | "HOST" = isHost ? "HOST" : rsvp;

  return {
    isHost,
    status,
    strike: rsvp === "DECLINED" ? "line-through" : "",
  };
}
