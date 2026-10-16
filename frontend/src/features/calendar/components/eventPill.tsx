import type { CalendarEvent } from "../lib/utils";
import { formatTime } from "@/shared/lib/dateFormat";
import { fullName } from "@/shared/lib/user";
import { FaCrown } from "react-icons/fa6";
import Link from "next/link";
import { useAuth } from "@/shared/auth/authContext";
import { twMerge } from "tailwind-merge";
import {
  FaCircleCheck,
  FaCircleQuestion,
  FaCircleXmark,
  FaClock,
} from "react-icons/fa6";

const statusIcon = {
  ACCEPTED: {
    icon: <FaCircleCheck className="fill-secondary" />,
    label: "Going",
  },
  MAYBE: { icon: <FaCircleQuestion className="fill-warn" />, label: "Maybe" },
  DECLINED: {
    icon: <FaCircleXmark className="fill-error" />,
    label: "Not going",
  },
  PENDING: {
    icon: <FaClock className="fill-(--color-text-muted)" />,
    label: "Not answered",
  },
};

const EventDetailStyles = {
  PENDING: "border border-primary hover:bg-primary/10",
  ACCEPTED: "bg-primary/15 text-primary hover:bg-primary/25",
  MAYBE: "bg-warn/15 hover:bg-warn/25",
  DECLINED: "bg-error/15 text-(--color-text-muted) hover:bg-error/25",
};

export default function EventPill({ event }: { event: CalendarEvent }) {
  const rsvp = event.invitees?.[0]?.rsvp;
  return (
    <div
      className={twMerge(
        "flex flex-col w-full gap-1 truncate rounded-lg px-2 py-0.5 text-left flock-caption",
        EventDetailStyles[rsvp] ?? "bg-info/15  hover:bg-info/25",
        rsvp === "DECLINED" ? "line-through" : "",
      )}
    >
      <span className="shrink-0 font-semibold inline-flex items-center justify-between">
        {formatTime(event.startsAt)}
        {rsvp && statusIcon[rsvp].icon}
      </span>
      <span className="truncate">{event.title}</span>
    </div>
  );
}

export function EventPillDetails({ event }: { event: CalendarEvent }) {
  const { user } = useAuth();
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
          EventDetailStyles[rsvp] ?? "bg-info/15  hover:bg-info/25",
        )}
      >
        <span
          className={twMerge(
            "truncate flock-body font-semibold! inline-flex justify-between items-center",
            rsvp === "DECLINED" ? "line-through" : "",
          )}
        >
          {event.title}
          {rsvp && statusIcon[rsvp].icon}
        </span>
        <span className="inline-flex gap-1 items-center">
          <FaCrown />
          <span className="flock-ui-label text-(--color-text-muted)">
            {user?.id === event.createdBy?.id
              ? "You"
              : fullName(event.createdBy)}
          </span>
        </span>
      </Link>
    </div>
  );
}
