"use client";

import Button from "@/shared/components/button";

export default function EventError({ retry }: { retry: () => void }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <h1 className="font-serif text-3xl text-error">Something went wrong</h1>
      <p className="text-foreground/70">We couldn&apos;t load this event.</p>
      <Button onClick={retry}>Try again</Button>
    </main>
  );
}
