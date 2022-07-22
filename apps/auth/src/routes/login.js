import express from "express";
import log from "loglevel";
log.setLevel("trace");

import { User } from "models";
import { sendLockedMail } from "../utils/sendMail.js";

const MAX_LOGIN_ATTEMPTS = 8; // make sure this is the same as in the user model
const router = express.Router();

router.route("/").post(async (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }, function (err, user) {
    if (err) {
      log.error(err);
      return res.status(500).json({
        message: "Internal server error.",
      });
    }
    if (!user) {
      // return generic invalid message
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // check if the account is currently locked
    if (user.isLocked) {
      log.debug("User is locked.");
      // just increment login attempts if account is already locked
      return user.incLoginAttempts(function (err) {
        if (err) {
          log.error(err);
          return res.status(500).json({
            message: "Internal server error.",
          });
        }

        // just return generic invalid message, we don't want to leak if the account is locked
        return res.status(401).json({
          message: "Invalid email or password.",
        });
      });
    }

    log.debug("User found, comparing passwords");

    user.comparePassword(password, function (err, isMatch) {
      if (err) {
        log.error(err);
        return res.status(500).json({
          message: "Internal server error.",
        });
      }
      if (isMatch) {
        log.debug("Passwords match");
        // TODO: generate a token for the user
        const token = "TODO";
        // reset attempts and lockUntil
        user.successfulLogin(function (err) {
          if (err) {
            log.debug(err);
            return res.status(500).json({
              message: "Internal server error.",
            });
          }
          // return success
          return res.status(200).json({
            message: "Login successful.",
            token,
          });
        });
      } else {
        log.debug("Passwords do not match");
        // increment failed login attempts
        user.incLoginAttempts(function (err) {
          if (err) {
            log.error(err);
            return res.status(500).json({
              message: "Internal server error.",
            });
          }
          // if we have reached max attempts, send the email
          if (user.loginAttempts + 1 === MAX_LOGIN_ATTEMPTS) {
            log.debug("Account is now locked");
            // send email to user saying their account is locked
            sendLockedMail(user.email);
          }
          return res.status(401).json({
            message: "Invalid email or password.",
          });
        });
      }
    });
  });
});

export { router as loginRouter };
