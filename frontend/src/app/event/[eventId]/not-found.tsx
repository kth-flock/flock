import Button from "@/shared/components/button";

export default function EventNotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <h1 className="flock-h1 text-primary">Event not found</h1>
      <p className="flock-body text-foreground/70">
        This event doesn’t exist or has been removed.
      </p>
      <Button href="/">Back home</Button>
    </main>
  );
}
