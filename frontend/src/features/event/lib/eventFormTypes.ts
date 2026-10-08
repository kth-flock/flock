import type { Location } from "@/shared/lib/nominatim";

export type EventFormValues = {
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  location: Location | null;
};
