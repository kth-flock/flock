import { Router } from "express";
import {
  searchLocations,
  reverseGeocode,
} from "../controllers/geogodeController";

export const geocodeRouter = Router();

// Search for Swedish locations by text query (?q=), max 5 results
geocodeRouter.get("/search", searchLocations);

// Get the location at a coordinate (?lat=&lon=)
geocodeRouter.get("/reverse", reverseGeocode);
