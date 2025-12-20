import express from "express";
import log from "loglevel";

import { Log } from "models";

log.setLevel("debug");

const router = express.Router();

router.route("/").get(async (req, res) => {
  log.debug(req.query);
  const daysAgo = req.query.daysAgo || 30;

  // get a date object at the start of the day of the given number of days ago
  let startDate = new Date();
  startDate.setDate(startDate.getDate() - daysAgo);
  startDate.setHours(0, 0, 0, 0);
  // log.debug(`startDate: ${startDate.toISOString()}`);

  let filter = {
    account: req.account,
    createdAt: {
      $gte: startDate.toISOString(),
    },
  };

  if (req.query.service) {
    filter.service = req.query.service;
  }
  if (req.query.environment) {
    filter.environment = req.query.environment;
  }
  if (req.query.status) {
    filter.status = req.query.status;
  }
  if (req.query.rollback && req.query.rollback === "true") {
    filter.rollback = req.query.rollback;
  }

  console.log(filter);

  try {
    const total = await Log.find(filter).countDocuments();
    return res.status(200).json(total);
  } catch (err) {
    log.error(err);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
});

export { router as totalDeploymentsRouter };
