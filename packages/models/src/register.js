const mongoose = require("mongoose");

let RegisterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: { unique: true },
    },
    account: {
      type: String,
      required: true,
    },
    uuid: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    collection: "registration",
    timestamps: true,
  }
);

RegisterSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });

const Register = mongoose.model("Register", RegisterSchema);

module.exports = {
  Register,
};
