import express from "express";
import log from "loglevel";

import { User, Account } from "models";

log.setLevel("debug");

const router = express.Router();

// GET /me - Get current user's information
router.route("/").get(async (req, res, next) => {
  try {
    const user = await User.findOne({
      email: req.email,
      account: req.account,
    });

    if (!user) {
      res.locals.status = 404;
      res.locals.body = {
        message: "User not found",
      };
      return next();
    }

    // Remove sensitive fields
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.salt;
    delete userObj.loginAttempts;
    delete userObj.lockUntil;

    res.locals.status = 200;
    res.locals.body = userObj;
    next();
  } catch (err) {
    log.error(err);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
});

// PATCH /me - Update current user's settings
router.route("/").patch(async (req, res, next) => {
  try {
    const user = await User.findOne({
      email: req.email,
      account: req.account,
    });

    if (!user) {
      res.locals.status = 404;
      res.locals.body = {
        message: "User not found",
      };
      return next();
    }

    // Only allow users to update specific fields
    const allowedUpdates = [
      "firstName",
      "lastName",
      "theme",
      "locale",
      "zoneInfo",
      "avatar",
    ];

    // Apply allowed updates
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    // Handle password change separately with validation
    if (req.body.password && req.body.currentPassword) {
      // Verify current password
      const isMatch = await user.comparePassword(req.body.currentPassword);
      
      if (!isMatch) {
        res.locals.status = 400;
        res.locals.body = {
          message: "Current password is incorrect",
        };
        return next();
      }

      // Fetch account to get password policy
      const account = await Account.findOne({ name: req.account });
      if (!account) {
        res.locals.status = 404;
        res.locals.body = {
          message: "Account not found",
        };
        return next();
      }

      const passwordPolicy = account.passwordPolicy;
      const newPassword = req.body.password;

      // Validate password against policy
      if (newPassword.length < passwordPolicy.length) {
        res.locals.status = 400;
        res.locals.body = {
          message: `Password must be at least ${passwordPolicy.length} characters long`,
        };
        return next();
      }

      // Count character types
      const lowercaseCount = (newPassword.match(/[a-z]/g) || []).length;
      const uppercaseCount = (newPassword.match(/[A-Z]/g) || []).length;
      const numberCount = (newPassword.match(/[0-9]/g) || []).length;
      const specialCount = (newPassword.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) || []).length;

      if (lowercaseCount < passwordPolicy.lowercase) {
        res.locals.status = 400;
        res.locals.body = {
          message: `Password must contain at least ${passwordPolicy.lowercase} lowercase letter${passwordPolicy.lowercase !== 1 ? 's' : ''}`,
        };
        return next();
      }

      if (uppercaseCount < passwordPolicy.uppercase) {
        res.locals.status = 400;
        res.locals.body = {
          message: `Password must contain at least ${passwordPolicy.uppercase} uppercase letter${passwordPolicy.uppercase !== 1 ? 's' : ''}`,
        };
        return next();
      }

      if (numberCount < passwordPolicy.number) {
        res.locals.status = 400;
        res.locals.body = {
          message: `Password must contain at least ${passwordPolicy.number} number${passwordPolicy.number !== 1 ? 's' : ''}`,
        };
        return next();
      }

      if (specialCount < passwordPolicy.special) {
        res.locals.status = 400;
        res.locals.body = {
          message: `Password must contain at least ${passwordPolicy.special} special character${passwordPolicy.special !== 1 ? 's' : ''}`,
        };
        return next();
      }

      // Set new password - the pre-save hook will hash it
      user.password = req.body.password;
    } else if (req.body.password && !req.body.currentPassword) {
      // Password change requested without current password
      res.locals.status = 400;
      res.locals.body = {
        message: "Current password is required to set a new password",
      };
      return next();
    }

    await user.save();

    // Remove sensitive fields from response
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.salt;
    delete userObj.loginAttempts;
    delete userObj.lockUntil;

    res.locals.status = 200;
    res.locals.body = userObj;
    next();
  } catch (err) {
    log.error(err);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
});

export { router as meRouter };
