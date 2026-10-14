import {
  FaCircleCheck,
  FaCircleQuestion,
  FaCircleXmark,
} from "react-icons/fa6";
import type { RSVP } from "@prisma/types";

type RSVPStatusProps = {
  status: RSVP;
  className?: string;
};

function getRSVPIndicator(status: RSVP) {
  switch (status) {
    case "PENDING":
      return (
        <FaCircleQuestion className="fill-(--color-text-muted) w-full h-full" />
      );
    case "ACCEPTED":
      return <FaCircleCheck className="fill-success w-full h-full" />;
    case "DECLINED":
      return <FaCircleXmark className="fill-error w-full h-full" />;
    case "MAYBE":
      return <FaCircleQuestion className="fill-warn w-full h-full" />;
  }
}

export default function RSVPStatus({ status, className }: RSVPStatusProps) {
  return <div className={className}>{getRSVPIndicator(status)}</div>;
}
