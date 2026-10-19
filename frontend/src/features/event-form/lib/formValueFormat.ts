import type { ExtendedEvent } from "@/shared/types/event";
import type { EventFormValues } from "@/features/event/lib/eventFormTypes";
import { formatDateInput, formatTimeInput } from "@/shared/lib/dateFormat";
import { combineDateTime } from "@/shared/lib/dateFormat";

export const emptyEventFormValues: EventFormValues = {
  title: "",
  description: "",
  startDate: "",
  startTime: "",
  endDate: "",
  endTime: "",
  location: null,
};

export type EventPayloadMode = "create" | "update";

export function eventToFormValues(event: ExtendedEvent): EventFormValues {
  return {
    title: event.title,
    description: event.description ?? "",
    startDate: formatDateInput(event.startsAt),
    startTime: formatTimeInput(event.startsAt),
    endDate: event.endsAt ? formatDateInput(event.endsAt) : "",
    endTime: event.endsAt ? formatTimeInput(event.endsAt) : "",
    location: {
      label: event.locationName ?? "",
      lat: event.latitude ?? undefined,
      lon: event.longitude ?? undefined,
    },
  };
}

export function formValuesToPayload(
  v: EventFormValues,
  mode: EventPayloadMode,
) {
  const startsAt = combineDateTime(v.startDate, v.startTime);
  const endsAt = combineDateTime(v.endDate, v.endTime);

  const errors: Record<string, string> = {};
  if (!startsAt) errors.startDate = "Enter a valid start date and time.";
  if ((v.endDate || v.endTime) && !endsAt)
    errors.endDate = "Enter a valid end date and time.";

  return {
    errors,
    payload: {
      title: v.title,
      description:
        mode === "create" ? v.description || undefined : v.description || null,
      locationName: v.location?.label,
      latitude: v.location?.lat,
      longitude: v.location?.lon,
      startsAt: startsAt ?? undefined,
      endsAt: mode === "create" ? (endsAt ?? undefined) : endsAt,
    },
  };
}
