const generateLogs = (services, environments) => {
  let logs = [];

  for (let i = 0; i < 500; i++) {
    let service = services[Math.floor(Math.random() * services.length)];
    let environment =
      environments[Math.floor(Math.random() * environments.length)];
    logs.push({
      account: "Seed",
      service: service,
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
      environment: environment,
      status: i % 10 == 0 ? "Failed" : "Deployed",
      version: `v1.${i}.0`,
      custom: {
        module: "foo",
        color: i % 2 == 0 ? "green" : "blue",
      },
    });
  }
  return logs;
};

export { generateLogs };
