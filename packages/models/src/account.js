const mongoose = require("mongoose");

const PasswordPolicySchema = new mongoose.Schema({
  length: {
    type: Number,
    default: 8,
    min: 8,
    max: 128,
  },
  lowercase: {
    type: Number,
    default: 0,
  },
  uppercase: {
    type: Number,
    default: 0,
  },
  number: {
    type: Number,
    default: 0,
  },
  special: {
    type: Number,
    default: 0,
  },
});

const AccountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    environments: {
      type: [String],
      required: false,
    },
    statuses: {
      type: [String],
      required: false,
    },
    passwordPolicy: {
      type: PasswordPolicySchema,
      required: true,
      default: () => ({
        length: 8,
        lowercase: 0,
        uppercase: 0,
        number: 0,
        special: 0,
      }),
    },
    auth: {
      type: String,
      required: true,
      default: "local",
    },
    ssoDomain: {
      type: String,
      required: false,
    },
    samlConfig: {
      type: Object,
      required: false,
    },
    samlRoleMapping: {
      type: Object,
      required: false,
    },
    sessionDuration: {
      type: Number,
      required: true,
      default: 8,
      min: 1,
      max: 720, // 30 days * 24 hours
    },
  },
  {
    collection: "accounts",
    timestamps: true,
  }
);

const Account = mongoose.model("Account", AccountSchema);

module.exports = {
  Account,
};
