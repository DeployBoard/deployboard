import express from "express";
const router = express.Router();

// Schemas
import { User } from "models";

router.route("/").post(async (req, res) => {
  const { email, password } = req.body;
  const newUser = new User({
    email,
    password,
  });

  try {
    // save user to database
    await newUser.save();
    // attempt to authenticate user
    const user = User.getAuthenticated(email, password);
    // register was successful if we have a user.
    if (user) {
      // TODO: handle success
      console.log("register successful");
      return;
    }
    // otherwise we can determine why we failed
    const reasons = User.failedLogin;
    switch (reasons) {
      case reasons.NOT_FOUND:
      case reasons.PASSWORD_INCORRECT:
        // note: these cases are treated the same way
        // don't tell the user why it failed, only that it did
        break;
      case reasons.MAX_ATTEMPTS:
        // send email to user saying they have reached max attempts and temporarily locked their account
        break;
    }
    // handle error
    console.log("register failed");
    return;
  } catch (e) {
    console.error("register error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export { router };
