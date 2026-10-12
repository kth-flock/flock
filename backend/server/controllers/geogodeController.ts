import { Request, Response } from "express";
import * as geocodeService from "../services/geocodeService";
import {
  searchLocationsSchema,
  reverseGeocodeSchema,
} from "@flock/shared/schemas/geocode";
import { validate } from "../utils/validate";

export async function searchLocations(req: Request, res: Response) {
  const parsedQuery = validate(
    searchLocationsSchema,
    req.query,
    "Invalid request",
  );

  try {
    const locations = await geocodeService.searchLocations(parsedQuery.q);
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
  const parsedQuery = validate(
    reverseGeocodeSchema,
    req.query,
    "Invalid coordinates",
  );

  try {
    const location = await geocodeService.reverseGeocode(
      parsedQuery.lat,
      parsedQuery.lon,
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
