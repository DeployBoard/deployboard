const mongoose = require("mongoose");
const composeWithMongoose =
  require("graphql-compose-mongoose").composeWithMongoose;

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    account: {
      type: String,
      required: true,
    },
    enabled: {
      type: Boolean,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: false,
    },
    hashedPassword: {
      type: String,
      required: false,
    },
    passwordExpires: {
      type: Date,
      required: false,
    },
    role: {
      type: String,
      required: true,
    },
    sso: {
      type: String,
      required: false,
    },
    sso_sub: {
      type: String,
      required: false,
    },
    locale: {
      type: String,
      required: true,
    },
    zoneInfo: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: false,
    },
    lastLoggedIn: {
      type: Date,
      required: true,
    },
    theme: {
      type: String,
      required: true,
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);
const UserTC = composeWithMongoose(User);

module.exports = {
  User,
  UserTC,
};
