import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import mongoSanitize from "express-mongo-sanitize";

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
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// sanitize mongoose queries
app.use(mongoSanitize());
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
