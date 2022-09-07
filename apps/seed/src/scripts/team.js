const generateTeams = () => {
  let teams = [];
  teams.push({
    name: "Team 1",
    account: "Seed",
    members: ["admin@seed.seed", "admin2@seed.seed"],
    meta: {
      Description: "This is team 1, they are awesome",
    },
    externalLinks: {
      "Confluence Space": "https://confluence.com",
      "Slack Channel": "https://slack.com",
      "Jira Project": "https://jira.com",
      "Github Team": "https://github.com",
    },
  });
  teams.push({
    name: "Team 2",
    account: "Seed",
    members: ["seedSaml@seedSaml.seed", "seedSaml2@seedSaml.seed"],
    meta: {
      Description: "This is team 2, they are also awesome",
    },
    externalLinks: {
      "Confluence Space": "https://confluence.com",
      "Slack Channel": "https://slack.com",
      "Jira Project": "https://jira.com",
      "Github Team": "https://github.com",
    },
  });
  return teams;
};

export { generateTeams };
