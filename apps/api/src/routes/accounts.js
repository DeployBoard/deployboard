import express from "express";
import log from "loglevel";

import { Account } from "models";

log.setLevel("trace");

const router = express.Router();

router.route("/").get(async (req, res, next) => {
  Account.findOne({ name: req.account }, function (err, account) {
    if (err) {
      log.error(err);
      return res.status(500).json({
        message: "Internal server error.",
      });
    }
    if (!account) {
      log.warn(`Account: ${req.account} not found, but was in the token.`);
      // return generic invalid message
      return res.status(401).json({
        message: "Unable to process this request.",
      });
    }
    res.locals.status = 200;
    res.locals.body = account;
    next();
  });
});

export { router as accountsRouter };
