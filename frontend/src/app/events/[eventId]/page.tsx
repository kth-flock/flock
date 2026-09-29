import type { Metadata } from "next";
// import { notFound } from "next/navigation";
import { FaCalendarDays, FaCircleUser, FaLocationDot } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";
import {
  exampleEvent,
  // getEvent,
  type EventAnnouncement,
  type EventComment,
  type EventDetails,
  type EventUser,
} from "./data";

// TODO: restore fetching by eventId once the backend is hooked up
// export async function generateMetadata({
//   params,
// }: PageProps<"/events/[eventId]">): Promise<Metadata> {
//   const { eventId } = await params;
//   const event = await getEvent(eventId);
//   return { title: event ? `${event.title} | Flock` : "Event not found | Flock" };
// }
export const metadata: Metadata = {
  title: `${exampleEvent.title} | Flock`,
};

export default async function EventPage(/* {
  params,
}: PageProps<"/events/[eventId]"> */) {
  // const { eventId } = await params;
  // const event = await getEvent(eventId);
  //
  // if (!event) notFound();
  const event = exampleEvent;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 pb-16">
      <EventHeader event={event} />
      <AnnouncementList announcements={event.announcements} />
    </main>
  );
}

// Formatting

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
});

const formatDate = (iso: string) => dateFormatter.format(new Date(iso));
const formatTime = (iso: string) => timeFormatter.format(new Date(iso));

function formatEventTime(startsAt: string, endsAt: string | null) {
  const start = `${formatDate(startsAt)}, ${formatTime(startsAt)}`;
  if (!endsAt) return start;

  const sameDay = formatDate(startsAt) === formatDate(endsAt);
  const end = sameDay
    ? formatTime(endsAt)
    : `${formatDate(endsAt)}, ${formatTime(endsAt)}`;

  return `${start} – ${end}`;
}

const fullName = (user: { firstName: string; lastName: string }) =>
  `${user.firstName} ${user.lastName}`;

// Components

function UserAvatar({
  user,
  className,
}: {
  user: EventUser;
  className?: string;
}) {
  const style = twMerge("size-8 shrink-0 rounded-full", className);

  return user.imageUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={user.imageUrl} alt={fullName(user)} className={twMerge(style, "object-cover")} />
  ) : (
    <FaCircleUser className={twMerge(style, "fill-accent")} aria-hidden />
  );
}

const detailStyle = "flex items-center gap-2 text-foreground/80";
const detailIconStyle = "size-4 shrink-0 fill-secondary";

function EventHeader({ event }: { event: EventDetails }) {
  return (
    <header className="flex flex-col gap-6">
      {event.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={event.imageUrl}
          alt=""
          className="h-48 md:h-72 w-full rounded-3xl object-cover shadow-lg"
        />
      )}

      <div className="flex flex-col gap-3">
        <h1 className="font-serif text-3xl md:text-5xl text-primary">
          {event.title}
        </h1>

        <div className="flex items-center gap-2 text-sm">
          <UserAvatar user={event.createdBy} className="size-6" />
          <span>
            Hosted by{" "}
            <span className="font-semibold">{fullName(event.createdBy)}</span>
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-2xl bg-accent/10 p-4 md:p-6">
        <p className={detailStyle}>
          <FaCalendarDays className={detailIconStyle} aria-hidden />
          <time dateTime={event.startsAt}>
            {formatEventTime(event.startsAt, event.endsAt)}
          </time>
        </p>
        {event.locationName && (
          <p className={detailStyle}>
            <FaLocationDot className={detailIconStyle} aria-hidden />
            {event.locationName}
          </p>
        )}
      </div>

      {event.description && (
        <p className="whitespace-pre-line leading-relaxed">
          {event.description}
        </p>
      )}
    </header>
  );
}

function PostMeta({ user, createdAt }: Pick<EventComment, "user" | "createdAt">) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <UserAvatar user={user} />
      <span className="font-semibold">{fullName(user)}</span>
      <time dateTime={createdAt} className="text-foreground/60">
        {formatDate(createdAt)}, {formatTime(createdAt)}
      </time>
    </div>
  );
}

function Announcement({ announcement }: { announcement: EventAnnouncement }) {
  return (
    <li className="flex flex-col gap-3 rounded-2xl border-2 border-neutral p-4 md:p-6">
      <PostMeta user={announcement.user} createdAt={announcement.createdAt} />
      <p className="whitespace-pre-line">{announcement.content}</p>

      {announcement.comments.length > 0 && (
        <ul className="flex flex-col gap-3 border-l-2 border-accent/50 pl-4">
          {announcement.comments.map((comment) => (
            <li key={comment.id} className="flex flex-col gap-1">
              <PostMeta user={comment.user} createdAt={comment.createdAt} />
              <p className="pl-10 whitespace-pre-line">{comment.content}</p>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function AnnouncementList({
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
