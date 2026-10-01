import { cache } from "react";
import { exampleEvent } from "./example_data";
import type { EventDetails } from "./types";

// Flip to false to load events from the backend instead of example_data.ts
const USE_EXAMPLE_DATA = true;

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const REQUEST_TIMEOUT_MS = 10_000;

// Returns null when the event doesn't exist or the id is invalid.
// Wrapped in cache() so generateMetadata and the page share one request.
export const getEvent = cache(
  async (eventId: string): Promise<EventDetails | null> => {
    if (USE_EXAMPLE_DATA) return exampleEvent;

    const response = await fetch(`${API_URL}/events/${eventId}`, {
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
