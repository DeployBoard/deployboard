import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import { verifyToken } from "./middleware/auth.js";
import { validateResponse } from "./middleware/response-validator.js";

import { accountsRouter } from "./routes/accounts.js";
import { analyticsRouter } from "./routes/analytics.js";
import { apikeysRouter } from "./routes/apikeys.js";
import { environmentsRouter } from "./routes/environments.js";
import { logsRouter } from "./routes/logs.js";
import { servicesRouter } from "./routes/services.js";
import { statusesRouter } from "./routes/statuses.js";
import { teamsRouter } from "./routes/teams.js";
import { usersRouter } from "./routes/users.js";

dotenv.config();

const app = express();
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json());
// parse text/plain
app.use(express.text());
// verify token
app.use(verifyToken);

// Routes
app.use("/accounts", accountsRouter);
app.use("/analytics", analyticsRouter);
app.use("/apikeys", apikeysRouter);
app.use("/environments", environmentsRouter);
app.use("/logs", logsRouter);
app.use("/services", servicesRouter);
app.use("/statuses", statusesRouter);
app.use("/teams", teamsRouter);
app.use("/users", usersRouter);

// response validation
app.use(validateResponse);

const port = process.env.PORT || 3001;

// Set strictQuery to true to enforce schema validation on queries
mongoose.set('strictQuery', true);

app.get("/h", (req, res) => {
  res.json({ status: "ok" });
});

// Initialize mongo connection and start server
const mongoUri = process.env.MONGO_URI || "mongodb://localhost/deployboard";

async function startServer() {
  try {
    await mongoose.connect(mongoUri);
    console.log("Mongo connection established.");
    
    app.listen(port, () => {
      console.log(`api service listening on port ${port}`);
    });
  } catch (e) {
    console.error("Mongo connection error:", e);
    process.exit(1);
  }
}

startServer();
