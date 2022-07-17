import mongoose from "mongoose";
import "./utils/db";

import { Log, Service, Account, User, Team, ApiKey } from "models";
import { generateServices } from "./scripts/service";
import { generateLogs } from "./scripts/log";
import { generateAccounts } from "./scripts/account";
import { generateUsers } from "./scripts/user";
import { generateTeams } from "./scripts/team";
import { generateApiKeys } from "./scripts/apiKey";

const services = [
  "Payment",
  "Search",
  "Notification",
  "Analytics",
  "Admin",
  "Auth",
];
const environments = ["Development", "Staging", "Production"];

const seed = async () => {
  if ((await mongoose.connection.readyState) > 0) {
    console.log("Dropping database...");
    await mongoose.connection.dropDatabase();
    console.log("Dropping database...done");
    console.log("Seeding database...");
    console.log("Generating services...");
    await Service.insertMany(generateServices(services, environments));
    console.log("Generating logs...");
    await Log.insertMany(generateLogs(services, environments));
    console.log("Generating accounts...");
    await Account.insertMany(generateAccounts());
    console.log("Generating users...");
    await User.insertMany(generateUsers());
    console.log("Generating teams...");
    await Team.insertMany(generateTeams());
    console.log("Generating api keys...");
    await ApiKey.insertMany(generateApiKeys());
    console.log("Seeding database...done");
    mongoose.connection.close();
  }
};

seed()
  .then(() => {
    // mongoose.connecation.close();
    console.log("done");
  })
  .catch((err) => {
    console.log(err);
    mongoose.connection.close();
    exit(1);
  });
