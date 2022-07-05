import mongoose from "mongoose";
import "../utils/db";

import { Log, Service } from "models";

if (mongoose.connection.readyState > 0) {
  console.log("Seeding database...");
} else {
  console.log("Database not connected, skipping seed...");
}

const generateLogs = () => {
  let logs = [];
  const services = ["service1", "service2", "service3"];
  const applications = ["application1", "application2", "application3"];
  const environments = ["Development", "Staging", "Production"];
  for (let i = 0; i < 100; i++) {
    let service = services[Math.floor(Math.random() * services.length)];
    let application =
      applications[Math.floor(Math.random() * applications.length)];
    let environment =
      environments[Math.floor(Math.random() * environments.length)];
    logs.push({
      account: "Seed",
      service: service,
      application: application,
      environment: environment,
      status: "Deploying",
      version: `v1.${i}.0`,
      custom: {
        module: "foo",
        color: i % 2 == 0 ? "green" : "blue",
      },
    });
    logs.push({
      account: "Seed",
      service: service,
      application: application,
      environment: environment,
      status: i % 50 == 0 ? "Failed" : "Deployed",
      version: `v1.${i}.0`,
      custom: {
        module: "foo",
        color: i % 2 == 0 ? "green" : "blue",
      },
    });
  }
  return logs;
};

Log.insertMany(generateLogs())
  .then((resp) => {
    console.log(resp);
    mongoose.connection.close();
  })
  .catch((err) => {
    console.log(err);
    mongoose.connection.close();
  });
