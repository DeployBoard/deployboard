const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema(
  {
    account: {
      type: String,
      required: true,
    },
    service: {
      type: String,
      required: true,
    },
    environment: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    version: {
      type: String,
      required: true,
    },
    rollback: {
      type: Boolean,
      required: false,
    },
  },
  {
    collection: "logs",
    timestamps: true,
  }
);

LogSchema.index({ createdAt: 1, updatedAt: 1 });

const Log = mongoose.model("Log", LogSchema);

module.exports = {
  Log,
};
