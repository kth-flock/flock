import type { CalendarEvent } from "../lib/types";
import { formatTime } from "@/shared/lib/dateFormat";
import { fullName } from "@/shared/lib/user";
import { FaCrown } from "react-icons/fa6";
import Link from "next/link";
import { useAuth } from "@/shared/auth/authContext";
import { twMerge } from "tailwind-merge";
import RsvpStatus from "@/features/rsvp/components/rsvpStatus";

const EventDetailStyles = {
  PENDING: "border border-primary hover:bg-primary/10",
  ACCEPTED: "bg-primary/15 text-primary hover:bg-primary/25",
  MAYBE: "bg-warn/15 hover:bg-warn/25",
  DECLINED: "bg-error/15 text-text-muted hover:bg-error/25",
  HOST: "bg-info/15  hover:bg-info/25",
};

export default function EventPill({ event }: { event: CalendarEvent }) {
  const { user } = useAuth();
  const isHost = event.createdById === user?.id;
  const status = isHost ? "HOST" : event.invitees?.[0]?.rsvp;
  return (
    <div
      className={twMerge(
        "flex flex-col w-full gap-1 truncate rounded-lg px-2 py-0.5 text-left flock-caption",
        EventDetailStyles[status],
        status === "DECLINED" ? "line-through" : "",
      )}
    >
      <span className="shrink-0 font-semibold inline-flex items-center justify-between">
        {formatTime(event.startsAt)}
        {status && <RsvpStatus rsvp={status} />}
      </span>
      <span className="truncate">{event.title}</span>
    </div>
  );
}

export function EventPillDetails({ event }: { event: CalendarEvent }) {
  const { user } = useAuth();
  const isHost = event.createdById === user?.id;
  const status = isHost ? "HOST" : event.invitees?.[0]?.rsvp;
  const hostLabel = isHost ? "You" : fullName(event.createdBy);
  const rsvp = event.invitees?.[0]?.rsvp;
  return (
    <div className="w-full flex gap-6 items-center">
      <span
        className={twMerge(
          "shrink-0 flock-lead font-semibold!",
          rsvp === "DECLINED" ? "line-through" : "",
        )}
      >
        {formatTime(event.startsAt)}
      </span>
      <Link
        href={`/event/${event.id}`}
        className={twMerge(
          "flex flex-col w-full gap-1 truncate rounded-lg px-4 py-2",
          EventDetailStyles[status],
        )}
      >
        <span
          className={twMerge(
            "truncate flock-body font-semibold! inline-flex justify-between items-center",
            rsvp === "DECLINED" ? "line-through" : "",
          )}
        >
          {event.title}
          {status && <RsvpStatus rsvp={status} />}
        </span>
        <span className="inline-flex gap-1 items-center">
          <FaCrown />
          <span className="flock-ui-label text-(--color-text-muted)">
            {hostLabel}
          </span>
        </span>
      </Link>
    </div>
  );
}
