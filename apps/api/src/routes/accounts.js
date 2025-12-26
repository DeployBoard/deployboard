import express from "express";
import log from "loglevel";
import { parseString } from "xml2js";

import { Account } from "models";
import { verifyRole } from "../middleware/auth.js";

log.setLevel("debug");

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

    // if we are not an admin, we want to remove some items from the response.
    if (!verifyRole(["Admin"], req.role)) {
      account.auth = undefined;
      account.ssoDomain = undefined;
      account.samlConfig = undefined;
      account.samlRoleMapping = undefined;
      account.passwordPolicy = undefined;
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

router.route("/").post(async (req, res, next) => {
  // verify the user has the correct role to access the resource
  if (!verifyRole(["Admin"], req.role)) {
    res.locals.status = 403;
    res.locals.body = {
      message: "You do not have permission to access this resource",
    };
    return next();
  }

  try {
    // get the account from the database.
    const account = await Account.findOne({ name: req.account });
    // if the account is not found, return a 404.
    if (!account) {
      return res.status(404).json({
        message: "Account not found.",
      });
    }
    // get ssoDomain, samlRoleMapping, sessionDuration, and passwordPolicy from payload
    const { auth, ssoDomain, samlRoleMapping, sessionDuration, passwordPolicy } = req.body;
    // if we have auth, update the account with the auth
    if (auth) {
      account.auth = auth;
    }
    // if we have ssoDomain, update the account with the ssoDomain
    if (ssoDomain) {
      account.ssoDomain = ssoDomain;
    }
    // if we have samlRoleMapping, update the account with the samlRoleMapping
    if (samlRoleMapping) {
      account.samlRoleMapping = samlRoleMapping;
    }
    // if we have sessionDuration, update the account with the sessionDuration
    if (sessionDuration !== undefined) {
      // validate sessionDuration is within acceptable range (1 hour to 30 days)
      if (sessionDuration < 1 || sessionDuration > 720) {
        return res.status(400).json({
          message: "Session duration must be between 1 and 720 hours.",
        });
      }
      account.sessionDuration = sessionDuration;
    }
    // if we have passwordPolicy, update the account with the passwordPolicy
    if (passwordPolicy) {
      // validate passwordPolicy fields
      if (passwordPolicy.length !== undefined) {
        if (passwordPolicy.length < 8 || passwordPolicy.length > 128) {
          return res.status(400).json({
            message: "Password length must be between 8 and 128 characters.",
          });
        }
        account.passwordPolicy.length = passwordPolicy.length;
      }
      if (passwordPolicy.lowercase !== undefined) {
        if (passwordPolicy.lowercase < 0) {
          return res.status(400).json({
            message: "Lowercase requirement cannot be negative.",
          });
        }
        account.passwordPolicy.lowercase = passwordPolicy.lowercase;
      }
      if (passwordPolicy.uppercase !== undefined) {
        if (passwordPolicy.uppercase < 0) {
          return res.status(400).json({
            message: "Uppercase requirement cannot be negative.",
          });
        }
        account.passwordPolicy.uppercase = passwordPolicy.uppercase;
      }
      if (passwordPolicy.number !== undefined) {
        if (passwordPolicy.number < 0) {
          return res.status(400).json({
            message: "Number requirement cannot be negative.",
          });
        }
        account.passwordPolicy.number = passwordPolicy.number;
      }
      if (passwordPolicy.special !== undefined) {
        if (passwordPolicy.special < 0) {
          return res.status(400).json({
            message: "Special character requirement cannot be negative.",
          });
        }
        account.passwordPolicy.special = passwordPolicy.special;
      }
      
      // Validate that the sum of character requirements doesn't exceed total length
      const totalRequired = 
        account.passwordPolicy.lowercase + 
        account.passwordPolicy.uppercase + 
        account.passwordPolicy.number + 
        account.passwordPolicy.special;
      
      if (totalRequired > account.passwordPolicy.length) {
        return res.status(400).json({
          message: `Total character requirements (${totalRequired}) cannot exceed password length (${account.passwordPolicy.length}).`,
        });
      }
    }
    // save the account
    await account.save();
    // return the modified account
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
    res.locals.status = 403;
    res.locals.body = {
      message: "You do not have permission to access this resource",
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
