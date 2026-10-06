import "dotenv/config";
import express from "express";
import cors from "cors";
import { usersRouter } from "./server/routes/users";
import authRouter from "./server/routes/auth";
import { geocodeRouter } from "./server/routes/geocode";
import { eventsRouter } from "./server/routes/events";
import { meRouter } from "./server/routes/me";
import { authMiddleware } from "./server/middleware/authMiddleware";
import { errorHandler } from "./server/middleware/errorHandlers";
import cookieParser from "cookie-parser";
import { imageRouter } from "./server/routes/image";

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json()); //body parsing middleware
app.use(cookieParser()); //cookie parsing middleware

app.get("/", (req, res) => {
  res.json({ message: "Express server running" });
});

// Routes
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/geocode", geocodeRouter);
app.use("/events", eventsRouter);
app.use("/me", authMiddleware, meRouter);
app.use("/image", authMiddleware, imageRouter);

app.use(errorHandler);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
