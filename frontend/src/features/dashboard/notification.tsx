"use client";
import ProfileImage from "@/shared/components/profileImage";
import Button from "@/shared/components/button";
import { fullName } from "@/shared/lib/user";
import type { DashboardNotification } from "./lib/types";

export type FriendRequestActionType = "ACCEPT" | "DECLINE";
export type NotificationAction = FriendRequestActionType | "VIEW";
export type NotificationType =
  | "req"
  | "invite"
  | "RSVP"
  | "announcement"
  | "comment";

// TODO: Add comment and announcements as notification
// TODO: Add dates to notifications

type NotificationProps = {
  notification: DashboardNotification;
  onAction: (action: NotificationAction) => void;
};

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
  notification,
  onAction,
}: NotificationProps) {
  const { from } = notification;

  return (
    <div className="flex gap-4 items-center p-4 cursor-pointer hover:bg-accent/10">
      {from.imageUrl ? (
        <ProfileImage profileImgSrc={from.imageUrl} />
      ) : (
        <ProfileImage firstName={from.firstName} lastName={from.lastName} />
      )}
      <div className="flex flex-col gap-2">
        <p className="flock-body">
          <b>{fullName(from)}</b>{" "}
          {notification.type === "RSVP"
            ? messageMap.RSVP[notification.RSVPstatus]
            : messageMap[notification.type]}
        </p>
        {notification.type === "req" && (
          <FriendRequestAction onAction={onAction} />
        )}
      </div>
    </div>
  );
}
