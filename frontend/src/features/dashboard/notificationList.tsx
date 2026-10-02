"use client";
import Notification, { NotificationAction } from "./notification";

// TODO: Fix mobile view

export default function NotificationList() {
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
      <div className="bg-primary text-white flock-h3 p-4 text-center w-full">
        Notifications
      </div>
      <div className="flex flex-col p-4 gap-4 w-full">
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
