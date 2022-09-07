import express from "express";
import log from "loglevel";

import { Team } from "models";

log.setLevel("debug");

const router = express.Router();

router.route("/").get(async (req, res, next) => {
  try {
    const teams = await Team.find({ account: req.account });
    res.locals.status = 200;
    res.locals.body = teams;
    next();
  } catch (err) {
    log.error(err);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
});

router.route("/:team").get(async (req, res, next) => {
  try {
    const team = await Team.findOne({
      account: req.account,
      team: req.params.team,
    });
    res.locals.status = 200;
    res.locals.body = team;
    next();
  } catch (err) {
    log.error(err);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
});

export { router as teamsRouter };
