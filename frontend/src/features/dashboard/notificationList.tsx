"use client";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import Notification, { NotificationAction } from "./notification";

// TODO: Fix mobile view

const headerStyle = "bg-primary text-white flock-h3 p-4 w-full";

export default function NotificationList() {
  // Only affects mobile, the list is always shown from md and up
  const [isOpen, setIsOpen] = useState(false);

  function handleAction(notifId: number, action: NotificationAction) {
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
        <Notification
          from="Sandra Kåhre"
          type="req"
          onAction={(type) => handleAction(1, type)}
        />
        <div className="w-full border-b border-primary/20" />
        <Notification
          from="Sandra Kåhre"
          type="invite"
          onAction={(type) => handleAction(2, type)}
        />
        <div className="w-full border-b border-primary/20" />
        <Notification
          from="Sandra Kåhre"
          type="RSVP"
          RSVPstatus="ACCEPTED"
          onAction={(type) => handleAction(3, type)}
        />
      </div>
    </div>
  );
}
