import mongoose from "mongoose";
import "../../utils/db";

import { Log, Service, Account, User, ApiKey } from "models";
import { generateServices } from "./service";
import { generateLogs } from "./log";
import { generateAccounts } from "./account";
import { generateUsers } from "./user";
import { generateApiKeys } from "./apiKey";

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
          console.log("Generating accounts...");
          Account.insertMany(generateAccounts())
            .then((resp) => {
              console.log(resp);
              console.log("Generating users...");
              User.insertMany(generateUsers())
                .then((resp) => {
                  console.log(resp);
                  console.log("Generating api keys...");
                  ApiKey.insertMany(generateApiKeys())
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
    })
    .catch((err) => {
      console.log(err);
      mongoose.connection.close();
      exit(1);
    });
} else {
  console.log("Database not connected, skipping seed...");
}
