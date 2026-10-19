"use client";

import { useMemo, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaPlus } from "react-icons/fa6";
import Button, { IconButton } from "@/shared/components/button";
import CalendarGridView from "./calendarGridView";
import CalendarListView from "./calendarListView";
import CalendarSkeleton from "./calendarSkeleton";
import { MONTHS, getMonthWeeks, groupEventsByDay } from "../lib/utils";
import { useFetch } from "@/shared/hooks/useFetch";
import { getMyEvents } from "@/features/event/lib/api";
import type { CalendarViewProps } from "../lib/types";

export default function CalendarWrapper() {
  const { data, isLoading, error, refetch } = useFetch(getMyEvents);
  const events = data ?? [];

  const [visibleMonth, setVisibleMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const today = useMemo(() => new Date(), []);
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const weeks = useMemo(() => getMonthWeeks(year, month), [year, month]);
  const eventsByDay = useMemo(() => groupEventsByDay(events), [events]);

  const changeMonth = (offset: number) =>
    setVisibleMonth((m) => new Date(m.getFullYear(), m.getMonth() + offset, 1));

  const viewProps: CalendarViewProps = {
    year,
    month,
    today,
    weeks,
    eventsByDay,
  };

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 flex items-center gap-4" role="alert">
          <p className="text-error">{error}</p>
          <Button type="button" variant="secondary" size="sm" onClick={refetch}>
            Retry
          </Button>
        </div>
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
              aria-label="Previous month"
              onClick={() => changeMonth(-1)}
            >
              <FaChevronLeft />
            </IconButton>
            <IconButton
              variant="secondary"
              size="sm"
              aria-label="Next month"
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

      {isLoading ? (
        <CalendarSkeleton />
      ) : (
        <>
          <div className="hidden md:block">
            <CalendarGridView {...viewProps} />
          </div>
          <div className="md:hidden">
            <CalendarListView {...viewProps} />
          </div>
        </>
      )}
    </div>
  );
}
