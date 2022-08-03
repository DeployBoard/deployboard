import express from "express";
import log from "loglevel";

import { Log } from "models";

log.setLevel("trace");

const router = express.Router();

router.route("/").get(async (req, res) => {
  log.debug(req.account);
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

  console.log(filter);

  Log.find(filter)
    .count()
    .exec(function (err, total) {
      if (err) {
        log.error(err);
        return res.status(500).json({
          message: "Internal server error.",
        });
      }
      return res.status(200).json(total);
    });
});

export { router as dataPerDayRouter };
