"use client";

import { useEffect, useState, useCallback } from "react";
import { getErrorMessage } from "@/shared/lib/errors";
import { ApiError } from "@/shared/lib/https";

export function useFetch<T>(fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setErrorStatus(null);

    fetcher()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getErrorMessage(err, "Failed to load"));
          setErrorStatus(err instanceof ApiError ? err.status : null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [fetcher, version]);

  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  return {
    data,
    setData,
    error,
    errorStatus,
    isLoading: data === null && error === null,
    refetch,
  };
}
