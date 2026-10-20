"use client";

import { useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { twMerge } from "tailwind-merge";

const LOADING_LOTTIE = "/flock-load.json";

export const DEFAULT_FLOCK_LOADER_MESSAGES = [
  "Securing the pond…",
  "Verifying your pond privileges…",
  "Making sure you are not a swan…",
  "Fetching your feathers…",
  "Quackifying credentials…",
  "Initiating quack protocol…",
  "Finding your flock…",
] as const;

type FlockLoaderProps = {
  /** Status line(s) under the animation. Defaults to the shared flock messages. */
  message?: string | readonly string[];
  /** How long each message stays when cycling (ms). Default 1000 */
  intervalMs?: number;
  className?: string;
  animationClassName?: string;
};

function pickRandomIndex(length: number) {
  return Math.floor(Math.random() * length);
}

/** Branded full-page / suspense loader (Lottie). Prefer `Spinner` for inline button loading. */
export default function FlockLoader({
  message = DEFAULT_FLOCK_LOADER_MESSAGES,
  intervalMs = 1000,
  className,
  animationClassName,
}: FlockLoaderProps) {
  const messages = (
    Array.isArray(message) ? message : message ? [message] : []
  ).filter(Boolean);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (messages.length <= 1) return;

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % messages.length);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [messages.length, intervalMs]);

  const current = messages[index] ?? messages[0];

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={"Loading"}
      className={twMerge(
        "flex flex-col items-center justify-center gap-1",
        className,
      )}
    >
      <div className={twMerge("size-48", animationClassName)}>
        <DotLottieReact
          src={LOADING_LOTTIE}
          loop
          autoplay
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      {current && (
        <p className="animate-pulse text-center flock-body-sm text-text-muted">
          {current}
        </p>
      )}
    </div>
  );
}
