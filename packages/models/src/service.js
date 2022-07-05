const mongoose = require("mongoose");

const environmentSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  status: {
    type: String,
  },
  version: {
    type: String,
  },
  timestamp: {
    type: Date,
  },
  custom: {
    type: mongoose.Schema.Types.Mixed,
  },
});

const ServiceSchema = new mongoose.Schema(
  {
    account: {
      type: String,
      required: true,
    },
    service: {
      type: String,
      required: true,
    },
    application: {
      type: String,
      required: true,
    },
    environments: {
      type: [environmentSchema],
      required: false,
    },
    tags: {
      type: Array(String),
      required: false,
    },
  },
  {
    collection: "services",
    timestamps: true,
  }
);

ServiceSchema.index({ createdAt: 1, updatedAt: 1 });

const Service = mongoose.model("Service", ServiceSchema);

module.exports = {
  Service,
};
