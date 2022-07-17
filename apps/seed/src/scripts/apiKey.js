const generateApiKeys = () => {
  let apiKeys = [];
  apiKeys.push({
    account: "Seed",
    key: "test-admin-key",
    name: "test-admin-api-key",
    role: "Admin",
    enabled: true,
    createdBy: "admin@seed.seed",
    modifiedBy: "admin@seed.seed",
  });
  apiKeys.push({
    account: "Seed",
    key: "test-editor-key",
    name: "test-editor-api-key",
    role: "Editor",
    enabled: true,
    createdBy: "admin@seed.seed",
    modifiedBy: "admin@seed.seed",
  });
  apiKeys.push({
    account: "Seed",
    key: "test-user-key",
    name: "test-user-api-key",
    role: "User",
    enabled: true,
    createdBy: "admin@seed.seed",
    modifiedBy: "admin@seed.seed",
  });
  return apiKeys;
};

export { generateApiKeys };
