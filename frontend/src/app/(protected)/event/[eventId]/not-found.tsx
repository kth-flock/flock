import ErrorState from "@/shared/components/ErrorState";

export default function EventNotFound() {
  return (
    <ErrorState
      variant="not-found"
      title="Event not found"
      message="This event doesn’t exist or has been removed."
      action={{ label: "Back home", href: "/" }}
    />
  );
}
