import { SchemaComposer } from "graphql-compose";

const schemaComposer = new SchemaComposer();

import { ServiceQuery, ServiceMutation } from "./service";
import { LogQuery, LogMutation } from "./log";

schemaComposer.Query.addFields({
  ...ServiceQuery,
  ...LogQuery,
});

schemaComposer.Mutation.addFields({
  ...ServiceMutation,
  ...LogMutation,
});

export default schemaComposer.buildSchema();
