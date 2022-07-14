import { SchemaComposer } from "graphql-compose";

const schemaComposer = new SchemaComposer();

import { ServiceQuery, ServiceMutation } from "./service";
import { LogQuery, LogMutation } from "./log";
import { AccountQuery, AccountMutation } from "./account";
import { UserQuery, UserMutation } from "./user";
import { TeamQuery, TeamMutation } from "./team";
import { ApiKeyQuery, ApiKeyMutation } from "./apiKey";

schemaComposer.Query.addFields({
  ...ServiceQuery,
  ...LogQuery,
  ...AccountQuery,
  ...UserQuery,
  ...TeamQuery,
  ...ApiKeyQuery,
});

schemaComposer.Mutation.addFields({
  ...ServiceMutation,
  ...LogMutation,
  ...AccountMutation,
  ...UserMutation,
  ...TeamMutation,
  ...ApiKeyMutation,
});

export default schemaComposer.buildSchema();
