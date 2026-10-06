"use client";
import ProfileImage from "@/shared/components/profileImage";
import Button from "@/shared/components/button";

export type FriendRequestActionType = "ACCEPT" | "DECLINE";
export type NotificationAction = FriendRequestActionType | "VIEW";
export type NotificationType =
  | "req"
  | "invite"
  | "RSVP"
  | "announcement"
  | "comment";

// TODO: Add comment and announcements as proper notification
// TODO: Add dates to notifications

type NotificationProps = {
  from: string; // Should be User type later
  onAction: (action: NotificationAction) => void;
} & (
  | { type: "req" | "invite"; RSVPstatus?: undefined }
  | { type: "RSVP"; RSVPstatus: "ACCEPTED" | "MAYBE" | "DECLINED" }
);

const messageMap = {
  req: "sent you a friend request!",
  invite: "invited you to their event!",
  RSVP: {
    ACCEPTED: "responded YES to your event!",
    MAYBE: "responded MAYBE to your event!",
    DECLINED: "responded NO to your event!",
  },
} as const;

function FriendRequestAction({
  onAction,
}: {
  onAction: (type: FriendRequestActionType) => void;
}) {
  return (
    <div className="flex gap-2">
      <Button variant="secondary" size="sm" onClick={() => onAction("ACCEPT")}>
        Accept
      </Button>
      <Button
        variant="secondary"
        size="sm"
        className="text-error border-error"
        onClick={() => onAction("DECLINE")}
      >
        Decline
      </Button>
    </div>
  );
}

export default function Notification({
  from,
  type,
  RSVPstatus,
  onAction,
}: NotificationProps) {
  return (
    <div className="flex gap-4 items-center p-4 cursor-pointer hover:bg-accent/10">
      <ProfileImage firstName={"firstName"} lastName={"lastName"} />
      <div className="flex flex-col gap-2">
        <p className="flock-body">
          <b>{from}</b>{" "}
          {type === "RSVP" ? messageMap.RSVP[RSVPstatus] : messageMap[type]}
        </p>
        {type === "req" && <FriendRequestAction onAction={onAction} />}
      </div>
    </div>
  );
}
