import {
  FaCircleCheck,
  FaCircleQuestion,
  FaCircleXmark,
  FaClock,
  FaCrown,
} from "react-icons/fa6";
import type { Rsvp } from "@/features/event/lib/types";

const statusIcon: Record<
  Rsvp | "HOST",
  { icon: React.ReactElement; label: string }
> = {
  HOST: { icon: <FaCrown className="fill-primary" />, label: "Hosting" },
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

export default function RsvpStatus({
  rsvp,
  expanded = false,
}: {
  rsvp: Rsvp | "HOST";
  expanded?: boolean;
}) {
  const { icon, label } = statusIcon[rsvp];

  return expanded ? (
    <span className="inline-flex shrink-0 gap-2 items-center flock-body">
      {icon}
      {label}
    </span>
  ) : (
    <span role="img" aria-label={label} title={label} className="inline-flex">
      {icon}
    </span>
  );
}
