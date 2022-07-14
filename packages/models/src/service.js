const mongoose = require("mongoose");
const composeWithMongoose =
  require("graphql-compose-mongoose").composeWithMongoose;

const EnvironmentSchema = new mongoose.Schema({
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
    environments: {
      type: [EnvironmentSchema],
      required: false,
    },
    team: {
      type: String,
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

const Service = mongoose.model("Service", ServiceSchema);
const ServiceTC = composeWithMongoose(Service);

module.exports = {
  Service,
  ServiceTC,
};
