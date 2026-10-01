import { cache } from "react";
import { API_BASE_URL } from "@/shared/lib/apiFetch";
import { exampleEvent } from "./exampleData";
import type { EventDetails } from "./types";

// Flip to false to load events from the backend instead of exampleData.ts
const USE_EXAMPLE_DATA = true;

const REQUEST_TIMEOUT_MS = 10_000;

// Returns null when the event doesn't exist or the id is invalid.
// Wrapped in cache() so generateMetadata and the page share one request.
export const getEvent = cache(
  async (eventId: string): Promise<EventDetails | null> => {
    if (USE_EXAMPLE_DATA) return exampleEvent;

    const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
      cache: "no-store",
      // Fail into error.tsx instead of hanging if the backend doesn't answer
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (response.status === 400 || response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch event ${eventId}: ${response.status}`);
    }

    return response.json();
  },
);
