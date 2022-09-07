const generateServices = (services, environments) => {
  let insertServices = [];
  const teams = ["Team 1", "Team 2"];

  services.forEach((service) => {
    let envs = [];
    environments.forEach((environment, index) => {
      const env = {
        name: environment,
        status: "Deployed",
        version: `v1.${index}.0`,
        timestamp: new Date(),
        custom: {
          module: "foo",
          color: "green",
        },
      };
      envs.push(env);
    });
    const tmpService = {
      account: "Seed",
      service: service,
      team: teams[Math.floor(Math.random() * teams.length)],
      environments: envs,
      meta: {
        Description: "This is a test service",
        Language: "JavaScript",
      },
      externalLinks: {
        GitHub: "https://github.com",
        Docs: "https://docs.deployboard.io",
        "Production URL": "https://app.deployboard.io",
        Swagger: "https://petstore.swagger.io",
      },
    };
    insertServices.push(tmpService);
  });
  return insertServices;
};

export { generateServices };
