import ErrorState from "@/shared/components/ErrorState";

export default function GlobalNotFound() {
  return (
    <ErrorState
      variant="not-found"
      title="Not found"
      message="This page doesn’t exist or has been removed."
      action={{ label: "Back home", href: "/" }}
    />
  );
}
