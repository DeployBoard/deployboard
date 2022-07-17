import moment from "moment";

const daysAgo = 120;
const daysArray = [...new Array(daysAgo)]
  .map((i, idx) => moment().startOf("day").subtract(idx, "days"))
  .reverse();

const generateLogs = (services, environments) => {
  let logs = [];
  let version = 0;
  // for each day
  daysArray.forEach((day) => {
    // generate a random number of deployments for this day between 0 and 15.
    const deploymentcount = Math.floor(Math.random() * 15);
    // for each deployment
    // set startTime do the day, we will increment this with each service deployment.
    // we will also increment the version number with each deployment.
    for (let i = 0, startTime = day; i < deploymentcount; i++, version++) {
      // choose a random service
      const service = services[Math.floor(Math.random() * services.length)];
      // generate a random deploymentLength between 3 and 15.
      const deploymentLength = Math.floor(Math.random() * 15) + 3;
      // generate a random waitingLength between 5 and 10.
      // this is how long we wait between environments.
      const waitingLength = Math.floor(Math.random() * 10) + 5;
      // for each environment
      for (let j = 0; j < environments.length; j++) {
        // mark if this deployment will be a success or failure with a 10% chance of failure.
        const failure = Math.random() < 0.1;
        // generate our createdAt date.
        let createdAt = startTime
          .clone()
          .add((i + j) * waitingLength, "minutes");
        // if this deployment is a failure, we need to create 2 logs for this deployment.
        // with the first log being a failure, and the second log being a success
        if (failure) {
          logs.push({
            account: "Seed",
            service: service,
            environment: environments[j],
            status: "Deploying",
            version: `v1.${version}.0`,
            custom: {
              module: "foo",
              color: i % 2 == 0 ? "green" : "blue",
            },
            createdAt,
            updatedAt: createdAt,
          });
          createdAt = createdAt.clone().add(deploymentLength, "minutes");
          logs.push({
            account: "Seed",
            service: service,
            environment: environments[j],
            status: "Failed",
            version: `v1.${version}.0`,
            custom: {
              module: "foo",
              color: i % 2 == 0 ? "green" : "blue",
            },
            createdAt,
            updatedAt: createdAt,
          });
          // wait for the waitingLength before creating the next log.
          createdAt = moment(createdAt).add(waitingLength, "minutes");
          logs.push({
            account: "Seed",
            service: service,
            environment: environments[j],
            status: "Deploying",
            version: `v1.${version}.0`,
            custom: {
              module: "foo",
              color: i % 2 == 0 ? "green" : "blue",
            },
            createdAt,
            updatedAt: createdAt,
          });
          createdAt = moment(createdAt).add(deploymentLength, "minutes");
          logs.push({
            account: "Seed",
            service: service,
            environment: environments[j],
            status: "Deployed",
            version: `v1.${version}.0`,
            custom: {
              module: "foo",
              color: i % 2 == 0 ? "green" : "blue",
            },
            createdAt,
            updatedAt: createdAt,
          });
        } else {
          // if this deployment is a success, we need to create 1 log for this deployment.
          logs.push({
            account: "Seed",
            service: service,
            environment: environments[j],
            status: "Deploying",
            version: `v1.${version}.0`,
            custom: {
              module: "foo",
              color: i % 2 == 0 ? "green" : "blue",
            },
            createdAt,
            updatedAt: createdAt,
          });
          createdAt = moment(createdAt).add(deploymentLength, "minutes");
          logs.push({
            account: "Seed",
            service: service,
            environment: environments[j],
            status: "Deployed",
            version: `v1.${version}.0`,
            custom: {
              module: "foo",
              color: i % 2 == 0 ? "green" : "blue",
            },
            createdAt,
            updatedAt: createdAt,
          });
        }
        startTime = createdAt;
      }
    }
  });
  return logs;
};

export { generateLogs };
