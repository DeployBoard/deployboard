import express from "express";
import log from "loglevel";

import { Service } from "models";

log.setLevel("trace");

const router = express.Router();

router.route("/").get(async (req, res, next) => {
  Service.find({ account: req.account }, function (err, services) {
    if (err) {
      log.error(err);
      return res.status(500).json({
        message: "Internal server error.",
      });
    }
    res.locals.status = 200;
    res.locals.body = services;
    next();
  });
});

export { router as servicesRouter };
