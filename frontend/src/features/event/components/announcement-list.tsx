import type { EventAnnouncement } from "../data";
import Announcement from "./announcement";

export default function AnnouncementList({
  announcements,
}: {
  announcements: EventAnnouncement[];
}) {
  // Newest first
  const sorted = [...announcements].sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  );

  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-serif text-2xl text-primary">Announcements</h2>
      {sorted.length === 0 ? (
        <p className="text-foreground/60">No announcements yet.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {sorted.map((announcement) => (
            <Announcement key={announcement.id} announcement={announcement} />
          ))}
        </ul>
      )}
    </section>
  );
}
