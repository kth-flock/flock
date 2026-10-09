import { Router } from "express";
import { Request, Response } from "express";

const BASE_URL = "https://photon.komoot.io";
const SWEDEN_BBOX = "10.9,55.3,24.2,69.1"; // minLon,minLat,maxLon,maxLat

export const geocodeRouter = Router();

export type PhotonFeature = {
  geometry: { coordinates: [number, number] };
  properties: {
    name?: string;
    street?: string;
    housenumber?: string;
    postcode?: string;
    city?: string;
    district?: string;
    locality?: string;
    county?: string;
    countrycode?: string;
  };
};

async function photon(path: "api" | "reverse", params: Record<string, string>) {
  const qs = new URLSearchParams({ lang: "en", ...params });
  const result = await fetch(`${BASE_URL}/${path}?${qs}`);
  if (!result.ok) throw new Error(`Upstream ${result.status}`);
  return (await result.json()) as { features: PhotonFeature[] };
}

function toLocation(f: PhotonFeature) {
  const p = f.properties;
  const [lon, lat] = f.geometry.coordinates;

  const street = [p.street, p.housenumber].filter(Boolean).join(" ");
  const city = p.city ?? p.district ?? p.locality ?? p.county;
  const postcodeAndCity = [p.postcode, city].filter(Boolean).join(" ");

  const name = p.name && p.name !== p.street ? p.name : undefined;

  const label = [name, street, postcodeAndCity].filter(Boolean).join(", ");

  return { lat, lon, label };
}

geocodeRouter.get("/search", async (req: Request, res: Response) => {
  const query = String(req.query.q ?? "").trim();
  if (query.length < 3) {
    return res
      .status(400)
      .json({ status: "Error", error: "Query must be at least 3 characters" });
  }

  try {
    const data = await photon("api", {
      q: query,
      limit: "10",
      bbox: SWEDEN_BBOX,
    });
    const results = data.features
      .filter((f) => f.properties.countrycode === "SE")
      .slice(0, 5)
      .map(toLocation);
    res.status(200).json({ status: "Success", data: results });
  } catch {
    res
      .status(502)
      .json({ status: "Error", error: "Geocoding service unavailable" });
  }
});

geocodeRouter.get("/reverse", async (req, res) => {
  const lat = Number(req.query.lat);
  const lon = Number(req.query.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return res
      .status(400)
      .json({ status: "Error", error: "Invalid coordinates" });
  }

  try {
    const data = await photon("reverse", {
      lat: String(lat),
      lon: String(lon),
    });
    const feature = data.features[0];
    if (!feature) {
      return res
        .status(404)
        .json({ status: "Error", error: "No result found" });
    }
    res.status(200).json({ status: "Success", data: toLocation(feature) });
  } catch {
    res
      .status(502)
      .json({ status: "Error", error: "Geocoding service unavailable" });
  }
});
