import "dotenv/config";
import express from "express";
import { usersRouter } from "./server/routes/users";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Express server running" });
});

// Routes
app.use("/users", usersRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
