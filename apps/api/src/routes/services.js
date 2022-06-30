import express from "express";
const router = express.Router();

// Schemas
import { Service } from "../models/service";
import { Log } from "../models/log";

router.route("/").get((req, res) => {
  res.json([
    {
      _id: "6295336d28bdcc8f6029e6fc",
      schema_version: 1,
      service: "Web",
      application: "Admin",
      account: "Example",
      tags: ["python"],
      environments: {
        Dev: {
          status: "Deployed",
          version: "1.3.0",
          timestamp: 1608433640,
          custom: { module: "foo", color: "green" },
        },
        Stage: {
          status: "Deployed",
          version: "1.2.1",
          timestamp: 1608523640,
          custom: { module: "foo", color: "green" },
        },
        Prod: {
          status: "Deployed",
          version: "1.2.0",
          timestamp: 1608623640,
          custom: { module: "foo", color: "green" },
        },
      },
    },
    {
      _id: "6295336d28bdcc8f6029e15a",
      schema_version: 1,
      service: "Web",
      application: "Sample",
      account: "Example",
      tags: ["python"],
      environments: {
        Dev: {
          status: "Deployed",
          version: "1.3.0",
          timestamp: 1608433640,
          custom: { module: "foo", color: "green" },
        },
        Stage: {
          status: "Deployed",
          version: "1.2.1",
          timestamp: 1608523640,
          custom: { module: "foo", color: "green" },
        },
        Prod: {
          status: "Deployed",
          version: "1.2.0",
          timestamp: 1608623640,
          custom: { module: "foo", color: "green" },
        },
      },
    },
    {
      _id: "6295336d28bdcc8f6029e42b",
      schema_version: 1,
      service: "Api",
      application: "Admin",
      account: "Example",
      tags: ["python"],
      environments: {
        Dev: {
          status: "Deployed",
          version: "1.3.0",
          timestamp: 1608433640,
          custom: { module: "foo", color: "green" },
        },
        Stage: {
          status: "Deployed",
          version: "1.2.1",
          timestamp: 1608523640,
          custom: { module: "foo", color: "green" },
        },
        Prod: {
          status: "Deployed",
          version: "1.2.0",
          timestamp: 1608623640,
          custom: { module: "foo", color: "green" },
        },
      },
    },
  ]);
});

export { router };
