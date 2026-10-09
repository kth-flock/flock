import type { PhotonFeature } from "../types/photon";
import type { Location } from "@flock/shared/schemas/geocode";

const BASE_URL = "https://photon.komoot.io";
const SWEDEN_BBOX = "10.9,55.3,24.2,69.1"; // minLon,minLat,maxLon,maxLat
const REQUEST_TIMEOUT_MS = 5000;
const FETCH_LIMIT = 10; // fetched from Photon, then filtered down to Sweden
const RESULTS_LIMIT = 5; // returned to the client

export class GeocodingUnavailableError extends Error {
  constructor(message = "Geocoding service unavailable") {
    super(message);
    this.name = "GeocodingUnavailableError";
  }
}

export async function searchLocations(query: string): Promise<Location[]> {
  const data = await photon("api", {
    q: query,
    limit: String(FETCH_LIMIT),
    bbox: SWEDEN_BBOX,
  });

  return data.features
    .filter((feature) => feature.properties.countrycode === "SE")
    .slice(0, RESULTS_LIMIT)
    .map(toLocation);
}

export async function reverseGeocode(
  lat: number,
  lon: number,
): Promise<Location | null> {
  const data = await photon("reverse", {
    lat: String(lat),
    lon: String(lon),
  });

  const feature = data.features[0];
  return feature ? toLocation(feature) : null;
}

async function photon(
  path: "api" | "reverse",
  params: Record<string, string>,
): Promise<{ features: PhotonFeature[] }> {
  const qs = new URLSearchParams({ lang: "en", ...params });

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}/${path}?${qs}`, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch {
    throw new GeocodingUnavailableError();
  }

  if (!response.ok) {
    throw new GeocodingUnavailableError(`Upstream ${response.status}`);
  }

  return (await response.json()) as { features: PhotonFeature[] };
}

function toLocation(feature: PhotonFeature): Location {
  const p = feature.properties;
  const [lon, lat] = feature.geometry.coordinates;

  const street = [p.street, p.housenumber].filter(Boolean).join(" ");
  const city = p.city ?? p.district ?? p.locality ?? p.county;
  const postcodeAndCity = [p.postcode, city].filter(Boolean).join(" ");

  const name = p.name && p.name !== p.street ? p.name : undefined;

  const label = [name, street, postcodeAndCity].filter(Boolean).join(", ");

  return { lat, lon, label };
}
