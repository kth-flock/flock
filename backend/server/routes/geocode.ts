import { Router } from "express";
import {
  searchLocations,
  reverseGeocode,
} from "../controllers/geogodeController";
import { authMiddleware } from "../middleware/authMiddleware";

export const geocodeRouter = Router();

// Search for Swedish locations by text query (?q=), max 5 results
geocodeRouter.get("/search", authMiddleware, searchLocations);

// Get the location at a coordinate (?lat=&lon=)
geocodeRouter.get("/reverse", authMiddleware, reverseGeocode);
