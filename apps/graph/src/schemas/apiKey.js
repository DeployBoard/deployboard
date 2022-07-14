import { ApiKeyTC } from "models";

const ApiKeyQuery = {
  apiKeyById: ApiKeyTC.getResolver("findById"),
  apiKeyByIds: ApiKeyTC.getResolver("findByIds"),
  apiKeyOne: ApiKeyTC.getResolver("findOne"),
  apiKeyMany: ApiKeyTC.getResolver("findMany"),
  apiKeyCount: ApiKeyTC.getResolver("count"),
  apiKeyConnection: ApiKeyTC.getResolver("connection"),
  apiKeyPagination: ApiKeyTC.getResolver("pagination"),
};

const ApiKeyMutation = {
  apiKeyCreateOne: ApiKeyTC.getResolver("createOne"),
  apiKeyCreateMany: ApiKeyTC.getResolver("createMany"),
  apiKeyUpdateById: ApiKeyTC.getResolver("updateById"),
  apiKeyUpdateOne: ApiKeyTC.getResolver("updateOne"),
  apiKeyUpdateMany: ApiKeyTC.getResolver("updateMany"),
  apiKeyRemoveById: ApiKeyTC.getResolver("removeById"),
  apiKeyRemoveOne: ApiKeyTC.getResolver("removeOne"),
  apiKeyRemoveMany: ApiKeyTC.getResolver("removeMany"),
};

export { ApiKeyQuery, ApiKeyMutation };
