const generateUsers = () => {
  let users = [];
  users.push({
    email: "admin@seed.seed",
    account: "Seed",
    enabled: true,
    salt: "69a0056b52554ef3c03793219ebad237",
    password: "$2b$12$ApfdONKAxhbxIVrojy.3aeecdbwePCErcfxJh97.y/yjThgzjoYT.",
    passwordExpires: 0,
    lastLoggedIn: new Date(),
    firstName: "Seed",
    lastName: "Admin",
    role: "Admin",
    sso: "None",
    ssoSub: "None",
    locale: "en_US",
    zoneInfo: "America/Los_Angeles",
    avatar: "None",
    theme: "light",
  });
  users.push({
    email: "seedSaml@seedSaml.seed",
    account: "SeedSaml",
    enabled: true,
    firstName: "SeedSaml",
    lastName: "Admin",
    role: "Admin",
    lastLoggedIn: new Date(),
    sso: "None",
    ssoSub: "None",
    locale: "en_US",
    zoneInfo: "America/Los_Angeles",
    avatar: "None",
    theme: "light",
  });
  return users;
};

export { generateUsers };
