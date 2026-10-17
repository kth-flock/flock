"use client";

import { useEffect, useState } from "react";
import { getErrorMessage } from "@/shared/lib/errors";

export function useFetch<T>(fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setError(null);

    fetcher()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err, "Failed to load"));
      });

    return () => {
      cancelled = true;
    };
  }, [fetcher, version]);

  return {
    data,
    error,
    isLoading: data === null && error === null,
    refetch: () => setVersion((v) => v + 1),
  };
}
