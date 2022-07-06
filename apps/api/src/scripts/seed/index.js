import mongoose from "mongoose";
import "../../utils/db";

import { Log, Service } from "models";
import { generateServices } from "./service";
import { generateLogs } from "./log";

if (mongoose.connection.readyState > 0) {
  console.log("Seeding database...");
  console.log("Generating services...");
  Service.insertMany(generateServices())
    .then((resp) => {
      console.log(resp);
      console.log("Generating logs...");
      Log.insertMany(generateLogs())
        .then((resp) => {
          console.log(resp);
          console.log("Seeding database...done");
          mongoose.connection.close();
        })
        .catch((err) => {
          console.log(err);
          mongoose.connection.close();
          exit(1);
        });
    })
    .catch((err) => {
      console.log(err);
      mongoose.connection.close();
      exit(1);
    });
} else {
  console.log("Database not connected, skipping seed...");
}
