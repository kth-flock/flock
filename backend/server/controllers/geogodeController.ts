import { Request, Response } from "express";
import * as geocodeService from "../services/geocodeService";
import {
  searchLocationsSchema,
  reverseGeocodeSchema,
} from "@flock/shared/schemas/geocode";

export async function searchLocations(req: Request, res: Response) {
  const result = searchLocationsSchema.safeParse(req.query);

  if (!result.success) {
    return res.status(400).json({
      status: "Error",
      error: "Invalid query",
      details: result.error.issues,
    });
  }

  try {
    const locations = await geocodeService.searchLocations(result.data.q);
    res.status(200).json({ status: "Success", data: locations });
  } catch (error) {
    if (error instanceof geocodeService.GeocodingUnavailableError) {
      return res
        .status(502)
        .json({ status: "Error", error: "Geocoding service unavailable" });
    }
    throw error;
  }
}

export async function reverseGeocode(req: Request, res: Response) {
  const result = reverseGeocodeSchema.safeParse(req.query);

  if (!result.success) {
    return res.status(400).json({
      status: "Error",
      error: "Invalid coordinates",
      details: result.error.issues,
    });
  }

  try {
    const location = await geocodeService.reverseGeocode(
      result.data.lat,
      result.data.lon,
    );

    if (!location) {
      return res
        .status(404)
        .json({ status: "Error", error: "No result found" });
    }

    res.status(200).json({ status: "Success", data: location });
  } catch (error) {
    if (error instanceof geocodeService.GeocodingUnavailableError) {
      return res
        .status(502)
        .json({ status: "Error", error: "Geocoding service unavailable" });
    }
    throw error;
  }
}
