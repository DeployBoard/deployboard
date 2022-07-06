const generateServices = () => {
  let insertServices = [];
  const services = ["service1", "service2", "service3"];
  const applications = ["application1", "application2", "application3"];
  const environments = ["Development", "Staging", "Production"];

  services.forEach((service) => {
    applications.forEach((application) => {
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
        application: application,
        environments: envs,
        tags: ["seed", "test", "javascript"],
      };
      insertServices.push(tmpService);
    });
  });
  return insertServices;
};

export { generateServices };
