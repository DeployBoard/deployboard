import express from "express";
import log from "loglevel";

import { User } from "models";

log.setLevel("trace");

const router = express.Router();

router.route("/").get(async (req, res, next) => {
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

export { router as usersRouter };
