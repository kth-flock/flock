import EventPreview, {
  SmallEventPreview,
} from "@/features/dashboard/eventPrievew";
import FriendPreview from "@/features/dashboard/friendPreview";
import NotificationList from "@/features/dashboard/notificationList";
import { getUpcomingEvents } from "@/features/event/lib/api";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [nextEvent, ...upcomingEvents] = await getUpcomingEvents();

  return (
    <main className="flex flex-col md:flex-row gap-4 md:gap-16 flex-1 items-center md:items-start justify-center mx-auto w-full max-w-5xl">
      <div className="md:sticky md:top-24 w-full flex flex-col gap-4 md:gap-12 md:order-last">
        <FriendPreview />
        <NotificationList />
      </div>
      <div className="w-full flex flex-col gap-4">
        <h2 className="flock-h2">Your next event</h2>
        {nextEvent && <EventPreview event={nextEvent} />}
        <h3 className="flock-h3">Upcoming</h3>
        <div className="flex flex-wrap gap-2 justify-between">
          {upcomingEvents.map((event) => (
            <SmallEventPreview key={event.id} event={event} />
          ))}
        </div>
      </div>
    </main>
  );
}
