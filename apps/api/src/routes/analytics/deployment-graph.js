import express from "express";
import log from "loglevel";

import { Log } from "models";

log.setLevel("debug");

const router = express.Router();

router.route("/").get(async (req, res) => {
  log.debug(req.query);
  const daysAgo = req.query.daysAgo || 30;

  let facet = {};
  // for each day get the number of successful deployments, failed deployments, and rollbacks
  for (let i = 0; i < daysAgo; i++) {
    const day = new Date();
    day.setDate(day.getDate() - i);
    const dayString = day.toISOString().split("T")[0];
    // create start of day
    const startOfDay = new Date();
    // create end of day
    const endOfDay = new Date();
    // set start of day to the day before
    startOfDay.setDate(startOfDay.getDate() - i);
    // set end of day to the day before
    endOfDay.setDate(endOfDay.getDate() - i);
    // set start of day to the start of the day
    startOfDay.setHours(0, 0, 0, 0);
    // set end of day to the end of the day
    endOfDay.setHours(23, 59, 59, 999);
    // create the facet to look like this: { "2019-01-01": { "Deployed": 0, "Failed": 0, "rollback": 0 } }
    facet[dayString] = [
      // match from the start of the day to the end of the day
      { $match: { createdAt: { $gte: startOfDay, $lt: endOfDay } } },
      // group by the deployment status
      {
        $group: {
          _id: null,
          Deployed: {
            $sum: { $cond: [{ $eq: ["$status", "Deployed"] }, 1, 0] },
          },
          Failed: { $sum: { $cond: [{ $eq: ["$status", "Failed"] }, 1, 0] } },
          rollback: {
            $sum: { $cond: [{ $eq: ["$rollback", true] }, 1, 0] },
          },
        },
      },
      // remove the _id field
      { $project: { _id: 0 } },
    ];
  }

  log.debug("facet", facet);

  // get a date object at the start of the day of the given number of days ago
  let startDate = new Date();
  startDate.setDate(startDate.getDate() - daysAgo);
  startDate.setHours(0, 0, 0, 0);
  // log.debug(`startDate: ${startDate.toISOString()}`);

  let filter = {
    account: req.account,
    createdAt: {
      $gte: startDate,
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

  log.debug("filter", filter);

  Log.aggregate([
    { $match: filter },
    { $facet: facet },
    // TODO: make sure this returns in the correct order.
  ])
    .then((logs) => {
      log.debug("logs", logs[0]);
      // create a new formattedLogs lobject
      const formattedLogs = {};
      // for each log in the logs array,
      Object.entries(logs[0]).forEach((entry) => {
        const [key, value] = entry;
        // if value is empty, set it to zero
        // TODO: Can this be moved to the aggregate?
        if (value.length === 0) {
          formattedLogs[key] = { Deployed: 0, Failed: 0, rollback: 0 };
        }
        // otherwise, set the value to the first element of the array
        else {
          formattedLogs[key] = value[0];
        }
      });
      // return the formatted logs object
      log.debug(formattedLogs);
      return res.status(200).json(formattedLogs);
    })
    .catch((err) => {
      log.error(err);
      return res.status(500).json({
        message: "Internal server error.",
      });
    });
});

export { router as deploymentGraphRouter };
