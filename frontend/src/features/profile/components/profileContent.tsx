import { twMerge } from "tailwind-merge";
import {
  FaCalendarCheck,
  FaCrown,
  FaClock,
  FaUsers,
} from "react-icons/fa6";
import type { EventSummary, InvitedEvent } from "@/features/event/lib/types";
import { formatMonthYear } from "@/shared/lib/dateFormat";
import type { UserSearchResult } from "@/shared/types/user";
import type { ProfileDetails } from "../lib/types";
import FriendStack from "./friendStack";

const countOf = (list: unknown[] | null) =>
  list ? String(list.length) : "-";

type ProfileContentProps = {
  profile: ProfileDetails;
  friends: UserSearchResult[] | null;
  myId?: number;
  hostedEvents?: EventSummary[] | null;
  invitedEvents?: InvitedEvent[] | null;
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
      value: countOf(friends),
      label: "Friends",
      extra: friends && friends.length > 0 && (
        <FriendStack friends={friends} myId={myId} />
      ),
    },
    ...(hostedEvents !== undefined
      ? [
          {
            icon: <FaCrown />,
            value: countOf(hostedEvents),
            label: "Events hosted",
          },
        ]
      : []),
    ...(invitedEvents !== undefined
      ? [
          {
            icon: <FaCalendarCheck />,
            value: countOf(invitedEvents),
            label: "Invitations",
          },
        ]
      : []),
  ];

  return (
    <section className={twMerge("grid gap-6", className)} aria-label="Profile content">
      {content.map(({ icon, value, label, extra }) => (
        <div key={label} className="@container rounded-2xl bg-accent/10 p-4 md:p-6">
          <div className="flex flex-col items-start gap-2 @[15rem]:flex-row @[15rem]:flex-wrap @[15rem]:items-center @[15rem]:gap-4">
            <span className="text-secondary shrink-0 [&>svg]:size-8" aria-hidden>
              {icon}
            </span>
            <div className="flex flex-col">
              <p className="flock-h3 text-primary">{value}</p>
              <p className="flock-body-sm text-foreground/80">{label}</p>
            </div>
            {extra}
          </div>
        </div>
      ))}
    </section>
  );
}
