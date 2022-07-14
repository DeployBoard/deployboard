import { AccountTC } from "models";

const AccountQuery = {
  accountById: AccountTC.getResolver("findById"),
  accountByIds: AccountTC.getResolver("findByIds"),
  accountOne: AccountTC.getResolver("findOne"),
  accountMany: AccountTC.getResolver("findMany"),
  accountCount: AccountTC.getResolver("count"),
  accountConnection: AccountTC.getResolver("connection"),
  accountPagination: AccountTC.getResolver("pagination"),
};

const AccountMutation = {
  accountCreateOne: AccountTC.getResolver("createOne"),
  accountCreateMany: AccountTC.getResolver("createMany"),
  accountUpdateById: AccountTC.getResolver("updateById"),
  accountUpdateOne: AccountTC.getResolver("updateOne"),
  accountUpdateMany: AccountTC.getResolver("updateMany"),
  accountRemoveById: AccountTC.getResolver("removeById"),
  accountRemoveOne: AccountTC.getResolver("removeOne"),
  accountRemoveMany: AccountTC.getResolver("removeMany"),
};

export { AccountQuery, AccountMutation };
