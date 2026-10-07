import { ExtendedEvent } from "@/shared/types/event";

const BASE_MAPS_URL = "https://www.google.com/maps/search/?api-1&";

export function getGoogleMapsUrl(event: ExtendedEvent) {
  const lat = event.latitude;
  const lng = event.longitude;
  const query = event.locationName;

  if (lat && lng) {
    return `${BASE_MAPS_URL}query=${lat},${lng}`;
  } else if (query) {
    return encodeURI(`${BASE_MAPS_URL}query=${query}`);
  }
}
