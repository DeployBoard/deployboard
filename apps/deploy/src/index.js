import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import rateLimitApiKey from "./middleware/rateLimitApiKey.js";
import validateApiKey from "./middleware/validateApiKey.js";
import validateBody from "./middleware/validateBody.js";
import { router } from "./routes/deploy.js";

const app = express();
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json());

// Routes
app.use("/deploy", rateLimitApiKey, validateApiKey, validateBody, router);

const port = process.env.PORT || 3003;

app.get("/h", (req, res) => {
  res.json({ status: "ok" });
});

// Initialize our mongo connection.
const mongoUri = process.env.MONGO_URI || "mongodb://localhost/deployboard";

async function startServer() {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(mongoUri);
    console.log("Mongo connection established.");
    
    app.listen(port, () => {
      console.log(`deploy service listening on port ${port}`);
    });
  } catch (e) {
    console.error("Failed to start server:", e);
    process.exit(1);
  }
}

startServer();
