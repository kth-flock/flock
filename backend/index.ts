import "dotenv/config";
import express from "express";
import cors from "cors";
import { usersRouter } from "./server/routes/users";
import authRouter from "./server/routes/auth";

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json()); //body parsing middleware

app.get("/", (req, res) => {
  res.json({ message: "Express server running" });
});

// Routes
app.use("/users", usersRouter);
app.use("/auth", authRouter);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
