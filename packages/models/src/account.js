const mongoose = require("mongoose");
const composeWithMongoose =
  require("graphql-compose-mongoose").composeWithMongoose;

const PasswordPolicySchema = new mongoose.Schema({
  length: {
    type: Number,
  },
  lowercase: {
    type: Number,
  },
  uppercase: {
    type: Number,
  },
  number: {
    type: Number,
  },
  special: {
    type: Number,
  },
});

const AccountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    environments: {
      type: [String],
      required: false,
    },
    passwordPolicy: {
      type: PasswordPolicySchema,
      required: true,
    },
    auth: {
      type: String,
      required: true,
    },
  },
  {
    collection: "accounts",
    timestamps: true,
  }
);

const Account = mongoose.model("Account", AccountSchema);
const AccountTC = composeWithMongoose(Account);

module.exports = {
  Account,
  AccountTC,
};
