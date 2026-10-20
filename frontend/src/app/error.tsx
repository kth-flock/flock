"use client";

import ErrorState from "@/shared/components/ErrorState";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Something went wrong"
      message={error.message || "Something went wrong. Please try again."}
      action={{ label: "Try again", onClick: reset }}
    />
  );
}
