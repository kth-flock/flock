"use client";

import { useEffect, useMemo, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaPlus } from "react-icons/fa6";
import Button, { IconButton } from "@/shared/components/button";
import { useAuth } from "@/shared/auth/authContext";
import { getCreatedEvents, getInvitedEvents } from "../lib/api";
import CalendarGridView from "./calendarGridView";
import CalendarListView from "./calendarListView";
import {
  type CalendarEvent,
  type CalendarViewProps,
  MONTHS,
  getMonthWeeks,
  groupEventsByDay,
} from "../lib/utils";

export default function CalendarWrapper() {
  const { user } = useAuth();
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    async function loadEvents() {
      try {
        const [invitedEvents, createdEvents] = await Promise.all([
          getInvitedEvents(),
          getCreatedEvents(),
        ]);
        const uniqueEvents = new Map(
          [
            ...createdEvents.map((event: CalendarEvent) => ({
              ...event,
              createdBy: user,
            })),
            ...invitedEvents,
          ].map((event) => [event.id, event]),
        );

        if (isCurrent) {
          setEvents(
            [...uniqueEvents.values()].map((event) => ({
              ...event,
              startsAt: new Date(event.startsAt),
            })),
          );
        }
      } catch (error) {
        if (isCurrent) {
          setLoadError(
            error instanceof Error ? error.message : "Failed to load events",
          );
        }
      }
    }

    void loadEvents();

    return () => {
      isCurrent = false;
    };
  }, [user]);

  const today = useMemo(() => new Date(), []);
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const weeks = useMemo(() => getMonthWeeks(year, month), [year, month]);
  const eventsByDay = useMemo(() => groupEventsByDay(events), [events]);

  function changeMonth(offset: number) {
    setVisibleMonth(new Date(year, month + offset, 1));
  }

  const viewProps: CalendarViewProps = {
    year,
    month,
    today,
    weeks,
    eventsByDay,
  };

  return (
    <div className="w-full">
      {loadError && (
        <p className="mb-4 text-error" role="alert">
          {loadError}
        </p>
      )}

      <div className="sticky top-0 z-20 -mx-6 flex items-center justify-between bg-background px-4 py-2 md:static md:mx-0 md:bg-transparent md:p-0 shadow-[0_4px_6px_-4px_rgba(0,0,0,0.15)]">
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-8">
          <h2 className="flock-h2 w-48 md:w-64 text-center">
            {MONTHS[month]} {year}
          </h2>
          <div className="flex gap-2">
            <IconButton
              variant="secondary"
              size="sm"
              onClick={() => changeMonth(-1)}
            >
              <FaChevronLeft />
            </IconButton>
            <IconButton
              variant="secondary"
              size="sm"
              onClick={() => changeMonth(1)}
            >
              <FaChevronRight />
            </IconButton>
          </div>
        </div>
        <Button icon={<FaPlus />} iconPlacement="left" href="/create-event">
          Add
        </Button>
      </div>

      <div className="hidden md:block">
        <CalendarGridView {...viewProps} />
      </div>
      <div className="md:hidden">
        <CalendarListView {...viewProps} />
      </div>
    </div>
  );
}
