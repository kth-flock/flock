import "dotenv/config";
import express from "express";
import cors from "cors";
import { usersRouter } from "./server/routes/users";
import { eventsRouter } from "./server/routes/events";

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Express server running" });
});

// Routes
app.use("/users", usersRouter);
app.use("/events", eventsRouter);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
