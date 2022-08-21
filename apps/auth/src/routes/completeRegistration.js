import express from "express";

import { Register, Account, User, ApiKey } from "models";

const router = express.Router();

router.route("/").post(async (req, res) => {
  const { uuid, password } = req.body;

  // check if the password is at least 8 characters long
  if (password.length < 8) {
    return res.status(400).json({
      message: "Password must be at least 8 characters long.",
    });
  }

  try {
    // look up the account and email associated with this uuid
    const register = await Register.findOne({ uuid });
    if (!register) {
      return res.status(400).json({
        message: "Invalid registration link. Try requesting a new one.",
      });
    }

    // verify the account does not already exist
    const existingAccount = await Account.findOne({ name: register.account });
    if (existingAccount) {
      // we do this before sending the registration email, so this should never occur.
      console.error("Account already exists:", existingAccount);
      return res.status(400).json({
        message:
          "Account already exists, please contact your administrator, or try another account name.",
      });
    }

    // create our newAccount object
    const newAccount = new Account({
      name: register.account,
    });
    // save the account to the database
    await newAccount.save();

    // create our newUser object
    const newUser = new User({
      account: register.account,
      email: register.email,
      role: "Admin",
      password,
    });
    // save the user to the database
    await newUser.save();

    // create a new deploy API key
    const newApiKey = new ApiKey({
      account: register.account,
      createdBy: register.email,
      modifiedBy: register.email,
      enabled: true,
      role: "Deploy",
      name: "Default",
    });

    // save the deploy API key to the database
    await newApiKey.save();

    // delete the register record
    await Register.deleteOne({ uuid });
    console.log(`Account: ${register.account} successfully registered.`);
  } catch (e) {
    console.error("complete registartion error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
  // return a success message
  return res.json({
    message: "Registration completed successfully.",
  });
});

export { router as completeRegistrationRouter };
