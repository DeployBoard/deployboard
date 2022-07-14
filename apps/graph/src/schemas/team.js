import { TeamTC } from "models";

const TeamQuery = {
  teamById: TeamTC.getResolver("findById"),
  teamByIds: TeamTC.getResolver("findByIds"),
  teamOne: TeamTC.getResolver("findOne"),
  teamMany: TeamTC.getResolver("findMany"),
  teamCount: TeamTC.getResolver("count"),
  teamConnection: TeamTC.getResolver("connection"),
  teamPagination: TeamTC.getResolver("pagination"),
};

const TeamMutation = {
  teamCreateOne: TeamTC.getResolver("createOne"),
  teamCreateMany: TeamTC.getResolver("createMany"),
  teamUpdateById: TeamTC.getResolver("updateById"),
  teamUpdateOne: TeamTC.getResolver("updateOne"),
  teamUpdateMany: TeamTC.getResolver("updateMany"),
  teamRemoveById: TeamTC.getResolver("removeById"),
  teamRemoveOne: TeamTC.getResolver("removeOne"),
  teamRemoveMany: TeamTC.getResolver("removeMany"),
};

export { TeamQuery, TeamMutation };
