import express from "express";
import { v4 as uuidv4 } from "uuid";

import { Register, Account } from "models";
import { sendMail } from "../utils/sendMail.js";

const router = express.Router();

router.route("/").post(async (req, res) => {
  const { account, email } = req.body;

  // init an empty uuid, we will only generate if we make it that far
  let uuid;

  try {
    // verify the account does not already exist
    const existingAccount = await Account.findOne({ name: account });
    if (existingAccount) {
      return res.status(400).json({
        message:
          "Account already exists, please contact your administrator, or try another account name.",
      });
    }
    // verify there is not already a pending registration for this email
    const pendingRegistrationAccount = await Register.findOne({ account });
    if (pendingRegistrationAccount) {
      return res.status(400).json({
        message:
          "Account already pending registration, please try again later.",
      });
    }
    // verify there is not already a pending registration for this email
    const pendingRegistrationEmail = await Register.findOne({ email });
    if (pendingRegistrationEmail) {
      return res.status(400).json({
        message:
          "Registration email already sent to this email, please try again later.",
      });
    }
    // create a uuid for the registration
    uuid = uuidv4();
    // create a new email in the register collection
    const newRegister = new Register({ account, email, uuid });
    // save the new register
    await newRegister.save();
  } catch (e) {
    console.error("register error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }

  // send an email to the user
  try {
    await sendMail(email, uuid);
  } catch (e) {
    console.error("email error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
  // return a success message
  return res.json({
    message: "Please check your email for a link to complete registration.",
  });
});

export { router as registerRouter };
