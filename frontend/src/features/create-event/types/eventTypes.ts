import type { Location } from "@/shared/lib/geocoding";

export type CreateEventDraft = {
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  location: Location | null;
};
