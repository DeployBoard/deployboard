import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";
import { composeWithMongoose } from "graphql-compose-mongoose";

export const ServiceSchema = new Schema(
  {
    service: {
      type: String,
      required: true,
    },
    application: {
      type: String,
      required: true,
    },
    account: {
      type: String,
      required: true,
    },
    environments: {
      type: Object,
      required: true,
    },
    tags: {
      type: Array(String),
      required: false,
    },
  },
  {
    collection: "services",
  }
);

ServiceSchema.plugin(timestamps);

ServiceSchema.index({ createdAt: 1, updatedAt: 1 });

const Service = mongoose.model("Service", ServiceSchema);
const ServiceTC = composeWithMongoose(Service);

export { Service, ServiceTC };
