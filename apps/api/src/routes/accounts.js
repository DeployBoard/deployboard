import express from "express";
import log from "loglevel";
import { parseString } from "xml2js";

import { Account } from "models";

log.setLevel("trace");

const router = express.Router();

router.route("/").get(async (req, res, next) => {
  try {
    // get the account from the database.
    const account = await Account.findOne({ name: req.account });
    // if the account is not found, return a 404.
    if (!account) {
      return res.status(404).json({
        message: "Account not found.",
      });
    }
    res.locals.status = 200;
    res.locals.body = account;
    next();
  } catch (err) {
    log.error(err);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
});

// Find the account matching our request, and put the body in the samlConfig field.
router.route("/samlConfig").post(async (req, res, next) => {
  // verify the user has the correct role to access the resource
  if (!verifyRole(["Admin"], req.role)) {
    res.locals.status = 401;
    res.locals.body = {
      message: "You are not authorized to access this resource",
    };
    return next();
  }

  // log.debug("req.body");
  // log.debug(req.body);
  // log.debug(JSON.stringify(req.body));

  // xmlparse the body and set samlConfig
  let samlConfig = null;
  parseString(req.body, (err, result) => {
    if (err) {
      log.error(err);
      return res.status(500).json({
        message: "Internal server error.",
      });
    }
    samlConfig = result;
  });

  // log.debug("samlConfig");
  // log.debug(JSON.stringify(samlConfig));

  try {
    // get the account from the database.
    const account = await Account.findOne({ name: req.account });
    // if the account is not found, return a 404.
    if (!account) {
      log.warn(`Account: ${req.account} not found, but was in the token.`);
      return res.status(404).json({
        message: "Account not found.",
      });
    }
    // set the samlConfig
    account.samlConfig = samlConfig;
    // save the account
    await account.save();
    res.locals.status = 200;
    res.locals.body = account;
    next();
  } catch (err) {
    log.error(err);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
});

export { router as accountsRouter };
