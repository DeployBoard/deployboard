import express from "express";
import log from "loglevel";

import { User } from "models";
import { verifyRole } from "../middleware/auth.js";

log.setLevel("debug");

const router = express.Router();

router.route("/").get(async (req, res, next) => {
  // verify the user has the correct role to access the resource
  if (!verifyRole(["Admin"], req.role)) {
    res.locals.status = 403;
    res.locals.body = {
      message: "You do not have permission to access this resource",
    };
    return next();
  }

  try {
    const users = await User.find({ account: req.account });
    
    // for each user in the list, remove the password
    const usersList = users.map((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      return userObj;
    });

    res.locals.status = 200;
    res.locals.body = usersList;
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
      message: "You are not authorized to access this resource",
    };
    return next();
  }

  // TODO: test this code
  // create a new user
  const user = new User(req.body);
  user.account = req.account;
  user.role = req.body.role;
  user.password = req.body.password;
  user.save((err) => {
    if (err) {
      log.error(err);
      return res.status(500).json({
        message: "Internal server error.",
      });
    }
    res.locals.status = 201;
    res.locals.body = user;
    next();
  });
});

export { router as usersRouter };
