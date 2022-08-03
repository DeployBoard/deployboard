import express from "express";
import log from "loglevel";

import { Service } from "models";

log.setLevel("trace");

const router = express.Router();

router.route("/").get(async (req, res) => {
  log.debug(req.account);

  Service.find({ account: req.account }, function (err, services) {
    if (err) {
      log.error(err);
      return res.status(500).json({
        message: "Internal server error.",
      });
    }
    return res.status(200).json(services);
  });
});

export { router as servicesRouter };
