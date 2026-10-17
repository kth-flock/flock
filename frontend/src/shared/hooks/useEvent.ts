"use client";

import { useCallback, useEffect, useState } from "react";
import { getEvent } from "@/shared/lib/api";

type Event = NonNullable<Awaited<ReturnType<typeof getEvent>>>;

export function useEvent(eventId: number) {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getEvent(eventId)
      .then((result) => {
        if (!cancelled) setEvent(result ?? null);
      })
      .catch((err) => {
        if (!cancelled)
          setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [eventId, version]);

  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  return { event, isLoading, error, refetch };
}
