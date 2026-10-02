import EventPreview, {
  SmallEventPreview,
} from "@/features/dashboard/eventPrievew";
import FriendPreview from "@/features/dashboard/friendPreview";
import NotificationList from "@/features/dashboard/notificationList";

export default function Home() {
  return (
    <main className="flex flex-col md:flex-row gap-4 md:gap-16 flex-1 items-center md:items-start justify-center w-full max-w-6xl">
      <div className="md:sticky md:top-24 w-full flex flex-col gap-4 md:gap-12 md:order-last">
        <FriendPreview />
        <NotificationList />
      </div>
      <div className="w-full flex flex-col gap-4">
        <h2 className="flock-h2">Your next event</h2>
        <EventPreview />
        <h3 className="flock-h3">Upcoming</h3>
        <div className="flex flex-wrap gap-2 justify-between">
          <SmallEventPreview />
          <SmallEventPreview />
        </div>
      </div>
    </main>
  );
}
