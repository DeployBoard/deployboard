import express from "express";
import log from "loglevel";

import { Account } from "models";
import { verifyRole } from "../middleware/auth";

log.setLevel("debug");

const router = express.Router();

router.route("/").get(async (req, res) => {
  try {
    const account = await Account.findOne({ name: req.account });
    if (!account) {
      log.warn(`Account: ${req.account} not found, but was in the token.`);
      // return generic invalid message
      return res.status(401).json({
        message: "Unable to process this request.",
      });
    }
    return res.status(200).json(account.environments);
  } catch (err) {
    log.error(err);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
});

router.route("/").post(async (req, res) => {
  try {
    // verify the user has the correct role to access the resource
    if (!verifyRole(["Editor", "Admin"], req.role)) {
      return res.status(401).json({
        message: "You are not authorized to access this resource.",
      });
    }
    // body should be an array of strings
    const environments = req.body;
    if (!environments || !Array.isArray(environments)) {
      return res.status(400).json({
        message: "Invalid request.",
      });
    }
    // get the existing account
    const account = await Account.findOne({ name: req.account });
    if (!account) {
      log.warn(`Account: ${req.account} not found, but was in the token.`);
      // return generic invalid message
      return res.status(401).json({
        message: "Unable to process this request.",
      });
    }
    // set the environments on the account overwriting the existing ones
    account.environments = environments;
    // save the account
    await account.save();
    // return the new environments
    return res.status(200).json(account.environments);
  } catch (err) {
    log.error(err);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
});

export { router as environmentsRouter };
