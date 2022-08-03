import express from "express";
import log from "loglevel";

import { Team } from "models";

log.setLevel("trace");

const router = express.Router();

router.route("/").get(async (req, res) => {
  log.debug(req.account);

  Team.find({ account: req.account }, function (err, teams) {
    if (err) {
      log.error(err);
      return res.status(500).json({
        message: "Internal server error.",
      });
    }
    return res.status(200).json(teams);
  });
});

export { router as teamsRouter };
