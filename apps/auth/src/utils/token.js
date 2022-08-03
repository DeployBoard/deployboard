import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      account: user.account,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "8h",
    }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

export { generateToken, verifyToken };
