const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    account: {
      type: String,
      required: true,
    },
    members: {
      type: [String],
      required: false,
    },
    tags: {
      type: [String],
      required: false,
    },
  },
  {
    collection: "teams",
    timestamps: true,
  }
);

const Team = mongoose.model("Team", TeamSchema);

module.exports = {
  Team,
};
