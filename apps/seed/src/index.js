import mongoose from "mongoose";
import dotenv from "dotenv";
import { Log, Service, Account, User, Team, ApiKey } from "models";
import { generateServices } from "./scripts/service.js";
import { generateLogs } from "./scripts/log.js";
import { generateAccounts } from "./scripts/account.js";
import { generateUsers } from "./scripts/user.js";
import { generateTeams } from "./scripts/team.js";
import { generateApiKeys } from "./scripts/apiKey.js";

dotenv.config();

const mongo_uri = process.env.MONGO_URI || "mongodb://localhost:27017/deployboard";
mongoose.set('strictQuery', true);

const services = [
  "Payment",
  "Search",
  "Notification",
  "Analytics",
  "Admin",
  "Auth",
];
const environments = ["Production","Staging", "Development"];

const seed = async () => {
  try {
    // Connect to MongoDB first
    await mongoose.connect(mongo_uri);
    console.log(`Connected to MongoDB at ${mongo_uri}`);

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
    await mongoose.connection.close();
    console.log("done");
  } catch (error) {
    console.error("Seeding error:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seed().catch((err) => {
    console.log(err);
    mongoose.connection.close();
    exit(1);
  });
