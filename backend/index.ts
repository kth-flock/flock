import "dotenv/config";
import express from "express";
import cors from "cors";
import { usersRouter } from "./server/routes/users";
import { geocodeRouter } from "./server/routes/geocode";
import { eventsRouter } from "./server/routes/events";
import { meRouter } from "./server/routes/me";
import { fakeAuth } from "./server/middleware/fakeAuth";
import { errorHandler } from "./server/utils/errorHandlers";

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Express server running" });
});

// Routes
app.use("/users", usersRouter);
app.use("/geocode", geocodeRouter);
app.use("/events", eventsRouter);
app.use("/me", fakeAuth, meRouter);

app.use(errorHandler);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
