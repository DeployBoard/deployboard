import express from "express";
const router = express.Router();

// Schemas
import { User } from "models";

router.route("/").post(async (req, res) => {
  const { email, password } = req.body;
  try {
    // find user by email
    const user = await User.findOne({ email });
    // if the user does not exist, return invalid
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    // if the user exists, check if the password is correct
    const isValid = await user.comparePassword(password);
    // if the password is incorrect, return invalid
    if (!isValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    // if the password is correct, generate a token
    const token = user.generateJWT();
    // return the token
    return res.json({ token });
  } catch (e) {
    console.error("token error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export { router };
