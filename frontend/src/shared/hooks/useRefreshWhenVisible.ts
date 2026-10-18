"use client";

import { useEffect, useRef } from "react";

export function useRefreshWhenVisible(
  callback: () => void,
  intervalMs: number,
) {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    function tick() {
      if (document.visibilityState === "visible") callbackRef.current();
    }
    const id = setInterval(tick, intervalMs);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [intervalMs]);
}
