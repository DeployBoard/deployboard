import express from "express";
import log from "loglevel";

import { verifyRole } from "../middleware/auth";
import { ApiKey } from "models";

log.setLevel("debug");

const router = express.Router();

router.route("/").get(async (req, res, next) => {
  // verify the user has the correct role to access the resource
  if (!verifyRole(["Admin"], req.role)) {
    res.locals.status = 401;
    res.locals.body = {
      message: "You are not authorized to access this resource",
    };
    return next();
  }

  ApiKey.find({ account: req.account }, function (err, apikeys) {
    if (err) {
      log.error(err);
      res.locals.status = 500;
      res.locals.body = {
        message: "Internal server error.",
      };
      return next();
    }
    res.locals.status = 200;
    res.locals.body = apikeys;
    next();
  });
});

// Create a new API key
router.route("/").post(async (req, res, next) => {
  // verify the user has the correct role to access the resource
  if (!verifyRole(["Admin"], req.role)) {
    res.locals.status = 401;
    res.locals.body = {
      message: "You are not authorized to access this resource",
    };
    return next();
  }

  // validate the request body against the schema
  try {
    await ApiKey.validate({
      account: req.account,
      createdBy: req.email,
      modifiedBy: req.email,
      enabled: req.body.enabled,
      role: req.body.role,
      name: req.body.name,
    });
  } catch (err) {
    res.locals.status = 400;
    res.locals.body = { message: err.message };
    return next();
  }

  // create a new API key
  ApiKey.create(
    {
      account: req.account,
      createdBy: req.email,
      modifiedBy: req.email,
      enabled: req.body.enabled,
      role: req.body.role,
      name: req.body.name,
    },
    function (err, apikey) {
      if (err) {
        log.error(err);
        res.locals.status = 500;
        res.locals.body = { message: "Internal server error." };
        return next();
      }
      log.debug(`Created API key: ${apikey}`);
      res.locals.status = 200;
      res.locals.body = { message: "API Key successfully created.", apikey };
      next();
    }
  );
});

// Delete an API key
router.route("/").delete(async (req, res, next) => {
  // verify the user has the correct role to access the resource
  if (!verifyRole(["Admin"], req.role)) {
    res.locals.status = 401;
    res.locals.body = {
      message: "You are not authorized to access this resource",
    };
    return next();
  }

  // delete the API key verifying the account
  ApiKey.deleteOne(
    {
      account: req.account,
      _id: req.body._id,
    },
    function (err, deleteResponse) {
      if (err) {
        log.error(err);
        res.locals.status = 500;
        res.locals.body = { message: "Internal server error." };
        return next();
      }
      log.debug(`Deleted API key: ${req.body._id}`);
      log.debug(deleteResponse);
      if (deleteResponse.deletedCount === 0) {
        res.locals.status = 404;
        res.locals.body = { message: "API Key not found." };
        next();
      } else {
        res.locals.status = 200;
        res.locals.body = { message: "API Key successfully deleted." };
        next();
      }
    }
  );
});

export { router as apikeysRouter };
