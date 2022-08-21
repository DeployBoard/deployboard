const generateApiKeys = () => {
  let apiKeys = [];
  apiKeys.push({
    account: "Seed",
    name: "test-admin-api-key",
    role: "Admin",
    enabled: true,
    createdBy: "admin@seed.seed",
    modifiedBy: "admin@seed.seed",
  });
  apiKeys.push({
    account: "Seed",
    name: "test-editor-api-key",
    role: "Editor",
    enabled: true,
    createdBy: "admin@seed.seed",
    modifiedBy: "admin@seed.seed",
  });
  apiKeys.push({
    account: "Seed",
    name: "test-user-api-key",
    role: "User",
    enabled: true,
    createdBy: "admin@seed.seed",
    modifiedBy: "admin@seed.seed",
  });
  apiKeys.push({
    account: "Seed",
    name: "test-deploy-api-key",
    role: "Deploy",
    enabled: true,
    createdBy: "admin@seed.seed",
    modifiedBy: "admin@seed.seed",
  });
  return apiKeys;
};

export { generateApiKeys };
