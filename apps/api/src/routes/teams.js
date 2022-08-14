import express from "express";
import log from "loglevel";

import { Team } from "models";

log.setLevel("trace");

const router = express.Router();

router.route("/").get(async (req, res, next) => {
  Team.find({ account: req.account }, function (err, teams) {
    if (err) {
      log.error(err);
      return res.status(500).json({
        message: "Internal server error.",
      });
    }
    res.locals.status = 200;
    res.locals.body = teams;
    next();
  });
});

export { router as teamsRouter };
