import express from "express";
const router = express.Router();

// Schemas
import { User } from "models";

router.route("/").get((req, res) => {
  res.json();
});

export { router };
