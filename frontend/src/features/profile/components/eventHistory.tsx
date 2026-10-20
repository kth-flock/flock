import { useState } from "react";
import { FaList } from "react-icons/fa6";
import Dropdown, { type DropdownOption } from "@/shared/components/dropdown";
import LoadError from "@/shared/components/loadError";
import RsvpStatus from "@/features/rsvp/components/rsvpStatus";
import {
  SmallEventPreview,
  type EventStatus,
} from "@/features/dashboard/components/eventPreview";
import type { EventSummary } from "@/features/event/lib/types";

type Filter = EventStatus | "ALL";

export type HistoryItem = {
  event: EventSummary;
  status: EventStatus;
  statusLabel?: string;
};

const hasEnded = (event: EventSummary) =>
  (event.endsAt ?? event.startsAt).getTime() < Date.now();

const filterStyle: Record<Filter, string> = {
  ALL: "bg-foreground/20 text-foreground",
  HOST: "bg-info-light text-info-dark",
  ACCEPTED: "bg-success-light text-success-dark",
  MAYBE: "bg-warn-light text-warn-dark",
  DECLINED: "bg-error-light text-error-dark",
  PENDING: "bg-neutral text-foreground",
};

const filterOptions: DropdownOption<Filter>[] = [
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

export default function EventHistory({
  title,
  sectionTitles,
  items,
  isLoading,
  loadingFallback,
  error,
  onRetry,
  emptyText,
  hiddenFilters = [],
}: {
  title: string;
  sectionTitles: { upcoming: string; past: string };
  items: HistoryItem[];
  isLoading: boolean;
  // Shown while loading, e.g. a skeleton. Falls back to a short text
  loadingFallback?: React.ReactNode;
  // Error message if loading failed, with a "Try again" button when onRetry is set
  error?: string | null;
  onRetry?: () => void;
  emptyText: string;
  hiddenFilters?: Filter[];
}) {
  const [filter, setFilter] = useState<Filter>("ALL");

  const shown = items.filter(
    ({ status }) => filter === "ALL" || status === filter,
  );
  const upcoming = shown
    .filter(({ event }) => !hasEnded(event))
    .toSorted(
      (a, b) => a.event.startsAt.getTime() - b.event.startsAt.getTime(),
    );
  const past = shown
    .filter(({ event }) => hasEnded(event))
    .toSorted(
      (a, b) => b.event.startsAt.getTime() - a.event.startsAt.getTime(),
    );
  const isEmpty = !isLoading && !error && items.length === 0;
  // Events that did load are still shown below an error
  const showLists = !isLoading && !isEmpty && (!error || items.length > 0);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <h2 className="flock-h2 text-primary">{title}</h2>
        <Dropdown
          label="Show events by answer"
          value={filter}
          options={filterOptions.filter(
            ({ value }) => !hiddenFilters.includes(value),
          )}
          onChange={setFilter}
          className={filterStyle[filter]}
        />
      </div>

      {isLoading &&
        (loadingFallback ?? (
          <p className="flock-body-sm text-text-muted">Loading events...</p>
        ))}

      {!isLoading && error && <LoadError onRetry={onRetry}>{error}</LoadError>}

      {isEmpty && (
        <p className="rounded-2xl border-2 border-dashed border-accent p-6 text-center flock-body-sm text-text-muted">
          {emptyText}
        </p>
      )}

      {showLists && (
        <>
          <HistorySection
            title={sectionTitles.upcoming}
            emptyText={
              filter === "ALL"
                ? "No upcoming events."
                : "No upcoming events with this answer."
            }
            items={upcoming}
          />
          <HistorySection
            title={sectionTitles.past}
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
  items: HistoryItem[];
}) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="flock-h4 text-primary">{title}</h3>
      {items.length === 0 ? (
        <p className="flock-body-sm text-text-muted">{emptyText}</p>
      ) : (
        items.map(({ event, status, statusLabel }) => (
          <SmallEventPreview
            key={event.id}
            event={event}
            status={status}
            statusLabel={statusLabel}
          />
        ))
      )}
    </section>
  );
}
