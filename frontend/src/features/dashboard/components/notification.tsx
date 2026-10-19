"use client";
import Link from "next/link";
import type { Notification as NotificationData } from "@flock/shared/schemas/notifications";
import ProfileImage from "@/shared/components/profileImage";
import Button from "@/shared/components/button";
import { getRelativeDatetime } from "@/shared/lib/dateFormat";
import { fullName } from "@/shared/lib/user";

type NotificationProps = {
  notification: NotificationData;
  isPending: boolean;
  onAccept: () => void;
  onDecline: () => void;
};

const rsvpMessage = {
  ACCEPTED: "is going to",
  MAYBE: "might come to",
  DECLINED: "can't come to",
} as const;

function message({ type, event, rsvp }: NotificationData) {
  const eventTitle = (
    <b className="inline-block max-w-full truncate align-bottom">
      {event?.title}
    </b>
  );

  switch (type) {
    case "INVITATION":
      return <>invited you to {eventTitle}</>;
    case "ANNOUNCEMENT":
      return <>posted an announcement in {eventTitle}</>;
    case "ANNOUNCEMENT_COMMENT":
      return <>commented on an announcement in {eventTitle}</>;
    case "FRIEND_REQUEST":
      return <>sent you a friend request</>;
    case "FRIEND_REQUEST_ACCEPTED":
      return <>accepted your friend request</>;
    case "RSVP":
      return (
        <>
          {rsvp && rsvp.status !== "PENDING"
            ? rsvpMessage[rsvp.status]
            : "responded to"}{" "}
          {eventTitle}
        </>
      );
  }
}

function FriendRequestActions({
  isPending,
  onAccept,
  onDecline,
}: Omit<NotificationProps, "notification">) {
  return (
    <div className="flex gap-2">
      <Button
        variant="secondary"
        size="sm"
        disabled={isPending}
        onClick={onAccept}
      >
        Accept
      </Button>
      <Button
        variant="secondary"
        size="sm"
        className="text-error border-error"
        disabled={isPending}
        onClick={onDecline}
      >
        Decline
      </Button>
    </div>
  );
}

export default function Notification({
  notification,
  ...actions
}: NotificationProps) {
  const { from, event, type } = notification;
  const href = event ? `/event/${event.id}` : `/profile/${from.id}`;

  return (
    <div className="flex flex-col transition-colors has-[a:hover]:bg-accent/10">
      <Link href={href} className="flex items-center gap-4 p-4">
        <ProfileImage
          firstName={from.firstName}
          lastName={from.lastName}
          profileImgSrc={from.imageUrl ?? ""}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="flock-body wrap-break-word">
            <b>{fullName(from)}</b> {message(notification)}
          </p>
          {type === "ANNOUNCEMENT" && notification.announcement && (
            <p className="flock-body-sm truncate text-text-muted">
              {notification.announcement.content}
            </p>
          )}
          {type === "RSVP" && notification.rsvp?.comment && (
            <p className="flock-body-sm truncate text-text-muted">
              {`"${notification.rsvp.comment}"`}
            </p>
          )}
          <time
            className="flock-caption"
            dateTime={notification.createdAt.toISOString()}
          >
            {getRelativeDatetime(notification.createdAt)}
          </time>
        </div>
      </Link>
      {type === "FRIEND_REQUEST" && (
        <div className="pb-4 pl-16">
          <FriendRequestActions {...actions} />
        </div>
      )}
    </div>
  );
}
