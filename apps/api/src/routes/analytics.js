import express from "express";
import log from "loglevel";

import { totalDeploymentsRouter } from "./analytics/total-deployments.js";
import { dataPerDayRouter } from "./analytics/data-per-day.js";
import { deploymentGraphRouter } from "./analytics/deployment-graph.js";

const router = express.Router();

router.get("/", function () {
  log.info(
    "TODO: handle the bare /analytics route. Maybe return a list of available endpoints?"
  );
});

router.use("/total-deployments", totalDeploymentsRouter);
router.use("/data-per-day", dataPerDayRouter);
router.use("/deployment-graph", deploymentGraphRouter);

export { router as analyticsRouter };
