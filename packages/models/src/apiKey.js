const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const ApiKeySchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: function () {
        return uuidv4();
      },
      required: true,
    },
    account: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["User", "Editor", "Admin", "Deploy"],
      required: true,
    },
    enabled: {
      type: Boolean,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    modifiedBy: {
      type: String,
      required: true,
    },
    lastUsed: {
      type: String,
      required: false,
    },
    lastUsedBy: {
      type: String,
      required: false,
    },
  },
  {
    collection: "apikeys",
    timestamps: true,
  }
);

const ApiKey = mongoose.model("ApiKey", ApiKeySchema);

module.exports = {
  ApiKey,
};
