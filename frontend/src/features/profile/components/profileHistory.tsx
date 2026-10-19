import { useState } from "react";
import { FaList } from "react-icons/fa6";
import Dropdown, { type DropdownOption } from "@/shared/components/dropdown";
import RsvpStatus from "@/features/rsvp/components/rsvpStatus";
import {
  SmallEventPreview,
  type EventStatus,
} from "@/features/dashboard/components/eventPreview";
import type { EventSummary, InvitedEvent } from "@/features/event/lib/types";
import { ProfileHistorySkeleton } from "./profilePageSkeleton";
import LoadError from "@/shared/components/loadError";

const hasEnded = (event: EventSummary) =>
  (event.endsAt ?? event.startsAt).getTime() < Date.now();

const filterStyle: Record<EventStatus | "ALL", string> = {
  ALL: "bg-foreground/20 text-foreground",
  HOST: "bg-info-light text-info-dark",
  ACCEPTED: "bg-success-light text-success-dark",
  MAYBE: "bg-warn-light text-warn-dark",
  DECLINED: "bg-error-light text-error-dark",
  PENDING: "bg-neutral text-foreground",
};

const filterOptions: DropdownOption<EventStatus | "ALL">[] = [
  {
    value: "ALL",
    label: "All events",
    icon: <FaList className="fill-text-muted" />,
  },
  { value: "ACCEPTED", label: "Going", icon: <RsvpStatus rsvp="ACCEPTED" /> },
  { value: "MAYBE", label: "Maybe", icon: <RsvpStatus rsvp="MAYBE" /> },
  {
    value: "DECLINED",
    label: "Not going",
    icon: <RsvpStatus rsvp="DECLINED" />,
  },
  {
    value: "PENDING",
    label: "Not answered",
    icon: <RsvpStatus rsvp="PENDING" />,
  },
  { value: "HOST", label: "Hosting", icon: <RsvpStatus rsvp="HOST" /> },
];

type ProfileHistoryProps = {
  hostedEvents: EventSummary[] | null;
  invitedEvents: InvitedEvent[] | null;
  isLoading: boolean;
  error?: string | null;
  onRetry?: () => void;
};

export default function ProfileHistory({
  hostedEvents,
  invitedEvents,
  isLoading,
  error,
  onRetry,
}: ProfileHistoryProps) {
  const [filter, setFilter] = useState<EventStatus | "ALL">("ALL");

  const allHistory = [
    ...(hostedEvents ?? []).map((event) => ({
      event,
      status: "HOST" as EventStatus,
    })),
    ...(invitedEvents ?? []).map((event) => ({
      event,
      status: event.invitees[0]?.rsvp ?? "PENDING",
    })),
  ];
  const history = allHistory.filter(
    ({ status }) => filter === "ALL" || status === filter,
  );

  const upcoming = history
    .filter(({ event }) => !hasEnded(event))
    .toSorted(
      (a, b) => a.event.startsAt.getTime() - b.event.startsAt.getTime(),
    );
  const past = history
    .filter(({ event }) => hasEnded(event))
    .toSorted(
      (a, b) => b.event.startsAt.getTime() - a.event.startsAt.getTime(),
    );
  const isEmpty =
    !isLoading && allHistory.length === 0 && hostedEvents && invitedEvents;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <h2 className="flock-h2 text-primary">My history</h2>
        <Dropdown
          label="Show events by answer"
          value={filter}
          options={filterOptions}
          onChange={setFilter}
          className={filterStyle[filter]}
        />
      </div>

      {isLoading && <ProfileHistorySkeleton />}

      {!isLoading && error && history.length === 0 && (
        <LoadError onRetry={onRetry}>
          {error ?? "Couldn't load your event history."}
        </LoadError>
      )}

      {!isLoading && error && history.length > 0 && (
        <LoadError onRetry={onRetry}>{error}</LoadError>
      )}

      {!isLoading && !isEmpty && (
        <>
          <HistorySection
            title="Upcoming events"
            emptyText={
              filter === "ALL"
                ? "No upcoming events."
                : "No upcoming events with this answer."
            }
            items={upcoming}
          />
          <HistorySection
            title="Past events"
            emptyText={
              filter === "ALL"
                ? "No past events yet."
                : "No past events with this answer."
            }
            items={past}
          />
        </>
      )}
    </section>
  );
}

function HistorySection({
  title,
  emptyText,
  items,
}: {
  title: string;
  emptyText: string;
  items: { event: EventSummary; status: EventStatus }[];
}) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="flock-h4 text-primary">{title}</h3>
      {items.length === 0 ? (
        <p className="flock-body-sm text-text-muted">{emptyText}</p>
      ) : (
        items.map(({ event, status }) => (
          <SmallEventPreview key={event.id} event={event} status={status} />
        ))
      )}
    </section>
  );
}
