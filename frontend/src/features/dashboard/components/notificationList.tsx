"use client";
import { twMerge } from "tailwind-merge";
import { useState, Fragment } from "react";
import { FaChevronDown } from "react-icons/fa6";
import type { Notification as NotificationData } from "@flock/shared/schemas/notifications";
import Notification from "./notification";
import { acceptFriendRequest, declineFriendRequest } from "@/shared/lib/api";

const headerStyle = "bg-primary text-background flock-h3 p-4 w-full";

export default function NotificationList({
  notifications,
  onFriendRequestHandled,
}: {
  notifications: NotificationData[] | null | undefined;
  onFriendRequestHandled: (
    notification: NotificationData,
    accepted: boolean,
  ) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFriendRequest(
    notification: NotificationData,
    accept: boolean,
  ) {
    setPendingId(notification.id);
    setError(null);
    try {
      await (accept ? acceptFriendRequest : declineFriendRequest)(
        notification.from.id,
      );
      onFriendRequestHandled(notification, accept);
    } catch (err) {
      setError(
        err instanceof TypeError
          ? "Couldn't reach the server. Try again."
          : err instanceof Error
            ? err.message
            : "Something went wrong",
      );
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="flex flex-col rounded-2xl border border-primary overflow-hidden">
      <div className={twMerge("hidden md:block text-center", headerStyle)}>
        Notifications
      </div>
      <button
        type="button"
        className={twMerge(
          "md:hidden flex items-center justify-between cursor-pointer",
          headerStyle,
        )}
        aria-expanded={isOpen}
        aria-controls="notification-list"
        onClick={() => setIsOpen((open) => !open)}
      >
        Notifications
        <FaChevronDown
          className={twMerge(
            "size-5 transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </button>
      <div
        id="notification-list"
        className={twMerge(
          "md:flex flex-col w-full",
          isOpen ? "flex" : "hidden",
        )}
      >
        {notifications === undefined && (
          <p className="p-4 text-center flock-body-sm text-text-muted">
            Loading…
          </p>
        )}
        {notifications === null && (
          <p className="p-4 text-center flock-body-sm text-error" role="alert">
            {"Couldn't load your notifications"}
          </p>
        )}
        {notifications?.length === 0 && (
          <p className="p-4 text-center flock-body-sm text-text-muted">
            No new notifications
          </p>
        )}
        {notifications?.map((notif, index) => (
          <Fragment key={notif.id}>
            {index > 0 && <div className="w-full border-b border-primary/20" />}
            <Notification
              notification={notif}
              isPending={pendingId === notif.id}
              onAccept={() => handleFriendRequest(notif, true)}
              onDecline={() => handleFriendRequest(notif, false)}
            />
          </Fragment>
        ))}
        {error && (
          <p className="p-4 text-center flock-caption text-error!" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
