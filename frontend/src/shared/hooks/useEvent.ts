"use client";

import { useCallback, useEffect, useState } from "react";
import { getEvent } from "@/features/event/lib/api";

type Event = NonNullable<Awaited<ReturnType<typeof getEvent>>>;

export function useEvent(eventId: number) {
  const [event, setEvent] = useState<Event | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setError(null);

    getEvent(eventId)
      .then((result) => {
        if (!cancelled) setEvent(result ?? null);
      })
      .catch((err) => {
        if (!cancelled)
          setError(err instanceof Error ? err : new Error(String(err)));
      });

    return () => {
      cancelled = true;
    };
  }, [eventId, version]);

  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  const isLoading = event === null && error === null;

  return { event, isLoading, error, refetch };
}
