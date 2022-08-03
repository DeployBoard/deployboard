const generateTeams = () => {
  let teams = [];
  teams.push({
    name: "Team 1",
    description: "Team 1 description",
    account: "Seed",
    members: ["admin@seed.seed", "admin2@seed.seed"],
    tags: ["tag1", "tag2"],
  });
  teams.push({
    name: "Team 2",
    description: "Team 2 description",
    account: "Seed",
    members: ["seedSaml@seedSaml.seed", "seedSaml2@seedSaml.seed"],
    tags: ["tag2", "tag3"],
  });
  return teams;
};

export { generateTeams };
