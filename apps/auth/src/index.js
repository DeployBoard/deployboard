import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";

import { loginRouter } from "./routes/login.js";
import { registerRouter } from "./routes/register.js";
import { completeRegistrationRouter } from "./routes/completeRegistration.js";

const app = express();
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Routes
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/complete-registration", completeRegistrationRouter);

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
