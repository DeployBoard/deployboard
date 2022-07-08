const mongoose = require("mongoose");
const composeWithMongoose =
  require("graphql-compose-mongoose").composeWithMongoose;

const ApiKeySchema = new mongoose.Schema(
  {
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
  },
  {
    collection: "apikeys",
    timestamps: true,
  }
);

const ApiKey = mongoose.model("ApiKey", ApiKeySchema);
const ApiKeyTC = composeWithMongoose(ApiKey);

module.exports = {
  ApiKey,
  ApiKeyTC,
};
