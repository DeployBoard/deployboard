import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";
import { composeWithMongoose } from "graphql-compose-mongoose";

export const LogSchema = new Schema(
  {
    service: {
      type: Schema.Types.ObjectId,
      ref: "Service",
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
    hash: {
      type: String,
      required: true,
    },
    hashChain: {
      type: String,
      required: true,
    },
  },
  {
    collection: "logs",
  }
);

LogSchema.plugin(timestamps);

LogSchema.index({ createdAt: 1, updatedAt: 1 });

const Log = mongoose.model("Log", LogSchema);
const LogTC = composeWithMongoose(Log);

export { Log, LogTC };
