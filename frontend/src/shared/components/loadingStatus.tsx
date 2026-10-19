"use client";

import { useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { twMerge } from "tailwind-merge";

const LOADING_LOTTIE = "/flock-load.json";

type LoadingStatusProps = {
  message?: string | string[];
  intervalMs?: number;
  className?: string;
  animationClassName?: string;
};

function pickRandomIndex(length: number) {
  return Math.floor(Math.random() * length);
}

export default function LoadingStatus({
  message,
  intervalMs = 1000,
  className,
  animationClassName,
}: LoadingStatusProps) {
  const messages = Array.isArray(message)
    ? message.filter(Boolean)
    : message
      ? [message]
      : [];

  const [index, setIndex] = useState(() =>
    messages.length > 0 ? pickRandomIndex(messages.length) : 0,
  );

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
      aria-label={current ?? "Loading"}
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
