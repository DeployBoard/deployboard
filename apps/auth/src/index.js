import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import { loginRouter } from "./routes/login.js";
import { registerRouter } from "./routes/register.js";
import { completeRegistrationRouter } from "./routes/completeRegistration.js";

const app = express();
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json());

// Routes
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/complete-registration", completeRegistrationRouter);

const port = process.env.PORT || 3002;

// Set strictQuery to true for consistent behavior
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
      console.log(`auth service listening on port ${port}`);
    });
  } catch (e) {
    console.error("Mongo connection error:", e);
    process.exit(1);
  }
}

startServer();
