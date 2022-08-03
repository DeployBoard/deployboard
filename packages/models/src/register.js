const mongoose = require("mongoose");
const composeWithMongoose =
  require("graphql-compose-mongoose").composeWithMongoose;

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
const RegisterTC = composeWithMongoose(Register);

module.exports = {
  Register,
  RegisterTC,
};
