"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa6";
import Button from "@/shared/components/button";
import { deleteEventFetch } from "@/shared/lib/api";

export function DeleteEventButton({ eventId }: { eventId: number }) {
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setIsDeleting(true);
    setError(null);
    try {
      await deleteEventFetch(eventId);
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof TypeError
          ? "Couldn't reach the server. Try again."
          : err instanceof Error
            ? err.message
            : "Something went wrong",
      );
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex shrink-0 flex-col items-end gap-1">
      {isConfirming ? (
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="tertiary"
            size="sm"
            disabled={isDeleting}
            onClick={() => setIsConfirming(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            icon={<FaTrash />}
            iconPlacement="left"
            className="bg-error text-white hover:bg-error-dark"
            disabled={isDeleting}
            onClick={handleDelete}
          >
            {isDeleting ? "Deleting..." : "Yes, delete event"}
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          icon={<FaTrash />}
          iconPlacement="left"
          className="border-error text-error hover:border-error-dark hover:bg-error/10 hover:text-error-dark"
          onClick={() => setIsConfirming(true)}
        >
          Delete event
        </Button>
      )}
      {error && (
        <p className="flock-caption text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default function DeleteEvent({ eventId }: { eventId: number }) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border-2 border-error/60 p-4">
      <h2 className="flock-h5 text-error">Danger zone</h2>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col">
          <p className="flock-ui-label">Delete event</p>
          <p className="flock-caption">
            Removes the event, its announcements and all invites.
            <br />
            {"This can't be undone."}
          </p>
        </div>
        <DeleteEventButton eventId={eventId} />
      </div>
    </section>
  );
}
