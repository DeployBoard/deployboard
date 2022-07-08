import { SchemaComposer } from "graphql-compose";

const schemaComposer = new SchemaComposer();

import { ServiceQuery, ServiceMutation } from "./service";
import { LogQuery, LogMutation } from "./log";
import { AccountQuery, AccountMutation } from "./account";
import { UserQuery, UserMutation } from "./user";

schemaComposer.Query.addFields({
  ...ServiceQuery,
  ...LogQuery,
  ...AccountQuery,
  ...UserQuery,
});

schemaComposer.Mutation.addFields({
  ...ServiceMutation,
  ...LogMutation,
  ...AccountMutation,
  ...UserMutation,
});

export default schemaComposer.buildSchema();
