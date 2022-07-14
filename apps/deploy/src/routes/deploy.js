import express from "express";
const router = express.Router();

// Schemas
import { User } from "models";

router.route("/").post((req, res) => {
  console.log(req);
  res.json({ status: "success" });
});

export { router };

// Create environment if not already existing
// handleEnvironment(deployment["account"], deployment["environment"]);

// Write to the logs collection
// insertIntoLogs(deployment);

// Check if there are any changes to the service
// Make the changes to the service - What changes would there be to the service????

// Update the service that matches our account+service.
// updateServiceWithLatest(deployment);

// Have we ever seen this tag for the same service and environment before?
// If so, flag this as a rollback

// return { status: "success" };
