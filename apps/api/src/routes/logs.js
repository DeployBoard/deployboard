import express from "express";
import log from "loglevel";

import { Log } from "models";

log.setLevel("trace");

const router = express.Router();

router.route("/").get(async (req, res, next) => {
  log.debug("query", req.query);
  const limit = req.query.limit || 25; // default to 25
  const skip = req.query.skip || 0; // default to 0
  const sort = req.query.sort || "desc"; // default to desc

  // create a filter from the specified query params
  // we don't just want to blindly pass the query params to the find() call
  let filter = { account: req.account };
  if (req.query.service) {
    filter.service = req.query.service;
  }
  if (req.query.environment) {
    filter.environment = req.query.environment;
  }
  if (req.query.status) {
    filter.status = req.query.status;
  }

  if (req.query.count) {
    log.debug("counting logs");
    Log.find(filter)
      .count()
      .exec(function (err, logsCount) {
        if (err) {
          log.error(err);
          return res.status(500).json({
            message: "Internal server error.",
          });
        }
        return res.status(200).json(logsCount);
      });
  } else {
    log.debug("fetching logs");
    Log.find(filter)
      .sort({ createdAt: sort })
      .limit(limit)
      .skip(skip)
      .exec(function (err, logs) {
        if (err) {
          log.error(err);
          return res.status(500).json({
            message: "Internal server error.",
          });
        }
        res.locals.status = 200;
        res.locals.body = logs;
        next();
      });
  }
});

export { router as logsRouter };
