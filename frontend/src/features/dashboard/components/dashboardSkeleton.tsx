import { FaUsers } from "react-icons/fa6";
import FriendPreviewSkeleton from "./friendPreviewSkeleton";
import NotificationListSkeleton from "./notificationListSkeleton";
import UpcomingEventsSkeleton from "./upcomingEventsSkeleton";

export default function DashboardSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-4 lg:flex-row lg:items-start lg:gap-16">
      <div className="flex w-full flex-col gap-4 lg:sticky lg:top-24 lg:order-last lg:gap-12">
        <div className="flex flex-col items-center w-full gap-4">
          <span className="inline-flex gap-3 items-center flock-h3 font-sans! font-bold!">
            <FaUsers />
            People you know
          </span>
          <FriendPreviewSkeleton />
        </div>
        <div className="flex flex-col rounded-2xl border border-primary overflow-hidden">
          <div className="bg-primary text-background flock-h3 p-4 w-full text-center">
            Notifications
          </div>
          <NotificationListSkeleton />
        </div>
      </div>
      <div className="flex w-full min-w-0 flex-col gap-4">
        <h2 className="flock-h2">Your next event</h2>
        <UpcomingEventsSkeleton />
      </div>
    </div>
  );
}
