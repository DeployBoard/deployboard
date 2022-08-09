import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";

import rateLimitApiKey from "./middleware/rateLimitApiKey.js";
import validateApiKey from "./middleware/validateApiKey.js";
import validateBody from "./middleware/validateBody.js";
import { router } from "./routes/deploy.js";

const app = express();
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Routes
app.use("/deploy", rateLimitApiKey, validateApiKey, validateBody, router);

const port = process.env.PORT || 3003;

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
  console.log(`deploy service listening on port ${port}`);
});
