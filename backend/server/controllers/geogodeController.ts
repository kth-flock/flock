import { Request, Response } from "express";
import * as geocodeService from "../services/geocodeService";
import {
  searchLocationsSchema,
  reverseGeocodeSchema,
} from "@flock/shared/schemas/geocode";
import { validate } from "../utils/validate";
import { NotFoundError } from "../utils/errors";

export async function searchLocations(req: Request, res: Response) {
  const parsedQuery = validate(
    searchLocationsSchema,
    req.query,
    "Invalid request",
  );

  const locations = await geocodeService.searchLocations(parsedQuery.q);
  res.status(200).json({ status: "Success", data: locations });
}

export async function reverseGeocode(req: Request, res: Response) {
  const parsedQuery = validate(
    reverseGeocodeSchema,
    req.query,
    "Invalid coordinates",
  );

  const location = await geocodeService.reverseGeocode(
    parsedQuery.lat,
    parsedQuery.lon,
  );

  if (!location) {
    throw new NotFoundError("No result found");
  }

  res.status(200).json({ status: "Success", data: location });
}
