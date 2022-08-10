import express from "express";
import log from "loglevel";

import { verifyRole } from "../middleware/auth";
import { ApiKey } from "models";

log.setLevel("trace");

const router = express.Router();

router.route("/").get(async (req, res) => {
  log.debug(req.account);

  // verify the user has the correct role to access the resource
  if (!verifyRole(["Admin"], req.role)) {
    return res.status(401).json({
      message: "You are not authorized to access this resource",
    });
  }

  ApiKey.find({ account: req.account }, function (err, apikeys) {
    if (err) {
      log.error(err);
      return res.status(500).json({
        message: "Internal server error.",
      });
    }
    return res.status(200).json(apikeys);
  });
});

export { router as apikeysRouter };
