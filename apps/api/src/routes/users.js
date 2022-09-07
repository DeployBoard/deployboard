import express from "express";
import log from "loglevel";

import { User } from "models";
import { verifyRole } from "../middleware/auth";

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

  let usersList = [];

  User.find({ account: req.account }, function (err, users) {
    if (err) {
      log.error(err);
      return res.status(500).json({
        message: "Internal server error.",
      });
    }
    // for each user in the list, remove the password
    users.forEach((user) => {
      user.password = undefined;
      console.log(user);
      usersList.push(user);
    });

    res.locals.status = 200;
    res.locals.body = usersList;
    next();
  });
});

router.route("/").post(async (req, res, next) => {
  // verify the user has the correct role to access the resource
  if (!verifyRole(["Admin"], req.role)) {
    res.locals.status = 401;
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
