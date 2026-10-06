"use client";
import { useState, Fragment } from "react";
import { FaChevronDown } from "react-icons/fa6";
import Notification, { NotificationAction } from "./notification";
import type { DashboardNotification } from "./lib/types";

const headerStyle = "bg-primary text-white flock-h3 p-4 w-full";

export default function NotificationList({
  notifications,
}: {
  notifications: DashboardNotification[];
}) {
  // Only affects mobile - list is always shown from md and up
  const [isOpen, setIsOpen] = useState(false);

  function handleAction(
    notif: DashboardNotification,
    action: NotificationAction,
  ) {
    switch (action) {
      case "ACCEPT":
        return;
      // return acceptFriendRequest(notif.id);
      case "DECLINE":
        return;
      // return declineFriendRequest(notif.id);
      case "VIEW":
        return;
      //return router.push(`/events/${notif.eventId}`);
    }
  }

  return (
    <div className="flex flex-col rounded-2xl border border-primary overflow-hidden">
      <div className={`hidden md:block text-center ${headerStyle}`}>
        Notifications
      </div>
      <button
        type="button"
        className={`md:hidden flex items-center justify-between cursor-pointer ${headerStyle}`}
        aria-expanded={isOpen}
        aria-controls="notification-list"
        onClick={() => setIsOpen((open) => !open)}
      >
        Notifications
        <FaChevronDown
          className={`size-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        id="notification-list"
        className={`${isOpen ? "flex" : "hidden"} md:flex flex-col w-full`}
      >
        {notifications.length === 0 && (
          <p className="p-4 text-center flock-body-sm text-(--color-text-muted)">
            No new notifications
          </p>
        )}
        {notifications.map((notif, index) => (
          <Fragment key={notif.id}>
            {index > 0 && <div className="w-full border-b border-primary/20" />}
            <Notification
              notification={notif}
              onAction={(action) => handleAction(notif, action)}
            />
          </Fragment>
        ))}
      </div>
    </div>
  );
}
