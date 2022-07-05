import mongoose, { Schema } from "mongoose";
import { composeWithMongoose } from "graphql-compose-mongoose";

const environmentSchema = new Schema({
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
    type: Schema.Types.Mixed,
  },
});

export const ServiceSchema = new Schema(
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
const ServiceTC = composeWithMongoose(Service);

export { Service, ServiceTC };
