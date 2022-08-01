import express from "express";
import log from "loglevel";
const router = express.Router();

log.setLevel("info");

// Schemas
import { Account, Log, Service } from "models";

router.route("/").post(async (req, res) => {
  try {
    // create environment if it doesn't exist
    await handleEnvironment(req.apiKeyObject.account, req.body.environment);

    // create the status if it doesn't exist
    await handleStatus(req.apiKeyObject.account, req.body.status);

    // insert the deployment details into the logs collection
    const log = await insertIntoLogs(
      req.apiKeyObject.account,
      req.body.service,
      req.body.environment,
      req.body.version,
      req.body.status
    );

    // Update the service that matches our account+service.
    await updateServiceWithLatest(
      req.apiKeyObject.account,
      req.body.service,
      req.body.environment,
      req.body.version,
      req.body.status,
      req.body.team || "",
      req.body.tags || [],
      log.createdAt,
      req.body.meta || {}
    );

    // if we have a completed Deployment, check to see if we have seen this version before and mark it as a rollback
    if (req.body.status === "Deployed") {
      await checkIfRollback(
        req.apiKeyObject.account,
        req.body.service,
        req.body.environment,
        req.body.version,
        req.body.status
      );
    }
  } catch (e) {
    log.error(e);
    res.status(500).json({
      error: e.message,
    });
  }

  res.json({ status: "success" });
});

export { router };

const handleEnvironment = async (account, environment) => {
  log.debug(`handleEnvironment: ${account} ${environment}`);
  // Get the account
  try {
    const accountObject = await Account.findOne({ name: account });

    // if the account is not found, throw an error
    if (!accountObject) {
      // this should not happen, so log an error
      log.error(`Account ${account} not found`);
      throw new Error("Account not found");
    }

    // if the environment is not found, add it to the environments array
    if (!accountObject.environments.includes(environment)) {
      // add the environment to the accountObject
      accountObject.environments.push(environment);
      // write the new accountObject object to the db
      accountObject.save();
    }
  } catch (e) {
    log.error("Account.findOne error", e);
    throw new Error(e);
  }
};

const handleStatus = async (account, status) => {
  log.debug(`handleStatus: ${account} ${status}`);
  // Get the account
  try {
    const accountObject = await Account.findOne({ name: account });

    // if the account is not found, throw an error
    if (!accountObject) {
      // this should not happen, so log an error
      log.error(`Account ${account} not found`);
      throw new Error("Account not found");
    }

    // if the status is not found, add it to the statuses array
    if (!accountObject.statuses.includes(status)) {
      // add the environment to the accountObject
      accountObject.statuses.push(status);
      // write the new accountObject object to the db
      accountObject.save();
    }
  } catch (e) {
    log.error("Account.findOne error", e);
    throw new Error(e);
  }
};

// insert the deployment details into the logs collection
const insertIntoLogs = async (
  account,
  service,
  environment,
  version,
  status
) => {
  log.debug(
    `insertIntoLogs: ${account} ${service} ${environment} ${version} ${status}`
  );
  try {
    const log = await Log.create({
      account,
      service,
      environment,
      version,
      status,
    });
    return log;
  } catch (e) {
    log.error(e);
    throw new Error(e);
  }
};

// Update the service that matches our account+service.
const updateServiceWithLatest = async (
  account,
  service,
  environment,
  version,
  status,
  team,
  tags,
  timestamp,
  meta
) => {
  log.debug(
    `updateServiceWithLatest: ${account} ${service} ${environment} ${version} ${status}`
  );
  // get the service
  try {
    const serviceObject = await Service.findOne({
      account,
      service,
    });
    if (!serviceObject) {
      // create the service
      const newServiceObject = await createNewService(
        account,
        service,
        environment,
        version,
        status,
        team,
        tags,
        timestamp,
        meta
      );
      // log the new service
      log.debug("Created new service", newServiceObject);
    } else {
      // update the service
      const updatedServiceObject = await updateExistingService(
        serviceObject,
        environment,
        version,
        status,
        team,
        tags,
        timestamp,
        meta
      );
    }
  } catch (e) {
    log.error(e);
    throw new Error(e);
  }
};

const createNewService = async (
  account,
  service,
  environment,
  version,
  status,
  team,
  tags,
  timestamp,
  meta
) => {
  log.debug(
    `createNewService: ${account} ${service} ${environment} ${version} ${status}`
  );
  // create the service
  try {
    const newServiceObject = await Service.create({
      account,
      service,
      environments: [
        {
          name: environment,
          version,
          status,
          timestamp,
        },
      ],
      team,
      tags,
      meta,
    });
    return newServiceObject;
  } catch (e) {
    log.error(e);
    throw new Error(e);
  }
};

const updateExistingService = async (
  serviceObject,
  environment,
  version,
  status,
  team,
  tags,
  timestamp,
  meta
) => {
  log.debug(
    `updateExistingService: ${serviceObject} ${environment} ${version} ${status}`
  );
  // update the service with team, tags, and meta
  try {
    serviceObject.team = team;
    serviceObject.tags = tags;
    serviceObject.meta = meta;

    // find the environment
    const environmentObject = serviceObject.environments.find(
      (envObject) => envObject.name === environment
    );
    // if the environment is not found, create it
    if (!environmentObject) {
      // add the environment to the serviceObject
      serviceObject.environments.push({
        name: environment,
        version,
        status,
        timestamp,
      });
      // write the updated serviceObject with the new environment object to the db
      serviceObject.save();
    } else {
      // the environment is found, update it
      environmentObject.version = version;
      environmentObject.status = status;
      environmentObject.timestamp = timestamp;
      // write the updated serviceObject with the now updated environment to the db
      serviceObject.save();
    }
  } catch (e) {
    log.error(e);
    throw new Error(e);
  }

  return serviceObject;
};

const checkIfRollback = async (
  account,
  service,
  environment,
  version,
  status
) => {
  log.debug(
    `checkIfRollback: ${account} ${service} ${environment} ${version} ${status}`
  );
  // check the logs collection to see if there are multiple logs for the same account, service, environment, version, and status
  try {
    const logs = await Log.find({
      account,
      service,
      environment,
      version,
      status,
    }).sort({ date: "desc" });
    // if there are more than 1 log, we have a rollback
    if (logs.length > 1) {
      // mark the most recent log as rollback
      const mostRecentLog = logs[logs.length - 1];
      mostRecentLog.rollback = true;
      mostRecentLog.save();
    }
  } catch (e) {
    log.error("checkIfRollback error", e);
    throw new Error(e);
  }
};
