import express from "express";
import log from "loglevel";

import { Service } from "models";

log.setLevel("debug");

const router = express.Router();

router.route("/").get(async (req, res, next) => {
  try {
    const services = await Service.find({ account: req.account });
    res.locals.status = 200;
    res.locals.body = services;
    next();
  } catch (err) {
    log.error(err);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
});

router.route("/:service").get(async (req, res, next) => {
  try {
    const service = await Service.findOne({
      account: req.account,
      service: req.params.service,
    });
    res.locals.status = 200;
    res.locals.body = service;
    next();
  } catch (err) {
    log.error(err);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
});

export { router as servicesRouter };
