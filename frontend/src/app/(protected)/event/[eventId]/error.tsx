"use client";

import ErrorState from "@/shared/components/ErrorState";

export default function EventError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Something went wrong"
      message="We couldn’t load this event."
      action={{ label: "Try again", onClick: reset }}
    />
  );
}
