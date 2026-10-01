"use client";

import Button from "@/shared/components/button";

export default function EventError({ retry }: { retry: () => void }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <h1 className="flock-h1 text-error">Something went wrong</h1>
      <p className="flock-body text-foreground/70">We couldn’t load this event.</p>
      <Button onClick={retry}>Try again</Button>
    </main>
  );
}
