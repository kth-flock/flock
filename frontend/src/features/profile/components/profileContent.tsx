import { twMerge } from "tailwind-merge";
import {
  FaCalendarCheck,
  FaHouseChimney,
  FaClock,
  FaUsers,
} from "react-icons/fa6";
import type { EventSummary, InvitedEvent } from "@/features/event/lib/types";
import { formatMonthYear } from "@/shared/lib/dateFormat";
import type { UserSearchResult } from "@/shared/types/user";
import type { ProfileDetails } from "../lib/types";
import FriendStack from "./friendStack";

type ProfileContentProps = {
  profile: ProfileDetails;
  friends: UserSearchResult[];
  myId?: number;
  hostedEvents?: EventSummary[];
  invitedEvents?: InvitedEvent[];
  className?: string;
};

export default function ProfileContent({
  profile,
  friends,
  myId,
  hostedEvents,
  invitedEvents,
  className = "grid-cols-2",
}: ProfileContentProps) {
  const content = [
    {
      icon: <FaClock />,
      value: formatMonthYear(profile.createdAt),
      label: "Member since",
    },
    {
      icon: <FaUsers />,
      value: String(friends.length),
      label: "Friends",
      extra: friends.length > 0 && <FriendStack friends={friends} myId={myId} />,
    },
    ...(hostedEvents
      ? [
          {
            icon: <FaHouseChimney />,
            value: String(hostedEvents.length),
            label: "Events hosted",
          },
        ]
      : []),
    ...(invitedEvents
      ? [
          {
            icon: <FaCalendarCheck />,
            value: String(invitedEvents.length),
            label: "Invitations",
          },
        ]
      : []),
  ];

  return (
    <section className={twMerge("grid gap-6", className)} aria-label="Profile content">
      {content.map(({ icon, value, label, extra }) => (
        <div
          key={label}
          className="flex flex-wrap items-center gap-4 rounded-2xl bg-accent/10 p-4 md:p-6"
        >
          <span className="text-secondary shrink-0 [&>svg]:size-8" aria-hidden>
            {icon}
          </span>
          <div className="flex flex-col">
            <p className="flock-h3 text-primary">{value}</p>
            <p className="flock-body-sm text-foreground/80">{label}</p>
          </div>
          {extra}
        </div>
      ))}
    </section>
  );
}
