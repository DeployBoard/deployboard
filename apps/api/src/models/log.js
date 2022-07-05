import mongoose, { Schema } from "mongoose";
import { composeWithMongoose } from "graphql-compose-mongoose";

export const LogSchema = new Schema(
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
  },
  {
    collection: "logs",
    timestamps: true,
  }
);

LogSchema.index({ createdAt: 1, updatedAt: 1 });

const Log = mongoose.model("Log", LogSchema);
const LogTC = composeWithMongoose(Log);

export { Log, LogTC };
