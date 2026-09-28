import { Router } from "express";

const BASE_URL = "https://nominatim.openstreetmap.org";

export const geocodeRouter = Router();

async function proxy(
  path: "search" | "reverse",
  params: Record<string, string>,
) {
  const qs = new URLSearchParams({
    format: "json",
    addressdetails: "1",
    ...params,
  });
  const upstream = await fetch(`${BASE_URL}/${path}?${qs}`, {
    headers: {
      "User-Agent": process.env.GEOCODING_USER_AGENT!,
      "Accept-Language": "en",
    },
  });
  if (!upstream.ok) throw new Error(`Upstream ${upstream.status}`);
  return upstream.json();
}

geocodeRouter.get("/search", async (req, res) => {
  try {
    const query = String(req.query.q).trim() ?? "";

    if (query.length < 4) {
      return res.status(400).json({
        status: "Error",
        error: "Query must be longer than 3 characters",
      });
    }

    const results = await proxy("search", {
      q: query,
      limit: "5",
      countrycodes: "se",
    });
    res.status(200).json({ status: "Success", data: results });
  } catch (error) {
    res.status(500).json({ status: "Error", error: "Internal server error" });
  }
});

geocodeRouter.get("/reverse", async (req, res) => {
  try {
    const lat = Number(req.query.lat);
    const lon = Number(req.query.lon);

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return res.status(400).json({ error: "Invalid coordinates" });
    }

    const results = await proxy("reverse", {
      lat: String(lat),
      lon: String(lon),
    });

    res.status(200).json({ status: "Success", data: results });
  } catch (error) {
    res.status(500).json({ status: "Error", error: "Internal server error" });
  }
});
