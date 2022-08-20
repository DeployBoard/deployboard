const generateUsers = () => {
  let users = [];
  users.push({
    email: "admin@seed.seed",
    account: "Seed",
    enabled: true,
    password: "$2b$12$qj2WO.G.LSA06KXCruLVmuJPwUhAV6OKgGd8xh6mKQUncf0t9zhFW",
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
    email: "editor@seed.seed",
    account: "Seed",
    enabled: true,
    password: "$2b$12$qj2WO.G.LSA06KXCruLVmuJPwUhAV6OKgGd8xh6mKQUncf0t9zhFW",
    passwordExpires: 0,
    lastLoggedIn: new Date(),
    firstName: "Seed",
    lastName: "Editor",
    role: "Editor",
    sso: "None",
    ssoSub: "None",
    locale: "en_US",
    zoneInfo: "America/Los_Angeles",
    avatar: "None",
    theme: "light",
  });
  users.push({
    email: "user@seed.seed",
    account: "Seed",
    enabled: true,
    password: "$2b$12$qj2WO.G.LSA06KXCruLVmuJPwUhAV6OKgGd8xh6mKQUncf0t9zhFW",
    passwordExpires: 0,
    lastLoggedIn: new Date(),
    firstName: "Seed",
    lastName: "User",
    role: "User",
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
