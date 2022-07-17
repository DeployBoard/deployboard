import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { router } from "./routes/login.js";

const app = express();
app.use(cors());

// Routes
app.use("/login", router);

const port = process.env.PORT || 3002;

// Initialize our mongo connection.
const mongoUri = process.env.MONGO_URI || "mongodb://localhost/deployboard";
mongoose.connect(
  mongoUri,
  () => {
    console.log("Mongo connection established.");
  },
  (e) => console.error(e)
);

app.get("/h", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`auth service listening on port ${port}`);
});
