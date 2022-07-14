import { ServiceTC } from "models";

const ServiceQuery = {
  serviceById: ServiceTC.getResolver("findById"),
  serviceByIds: ServiceTC.getResolver("findByIds"),
  serviceOne: ServiceTC.getResolver("findOne"),
  serviceMany: ServiceTC.getResolver("findMany"),
  serviceCount: ServiceTC.getResolver("count"),
  serviceConnection: ServiceTC.getResolver("connection"),
  servicePagination: ServiceTC.getResolver("pagination"),
};

const ServiceMutation = {
  serviceCreateOne: ServiceTC.getResolver("createOne"),
  serviceCreateMany: ServiceTC.getResolver("createMany"),
  serviceUpdateById: ServiceTC.getResolver("updateById"),
  serviceUpdateOne: ServiceTC.getResolver("updateOne"),
  serviceUpdateMany: ServiceTC.getResolver("updateMany"),
  serviceRemoveById: ServiceTC.getResolver("removeById"),
  serviceRemoveOne: ServiceTC.getResolver("removeOne"),
  serviceRemoveMany: ServiceTC.getResolver("removeMany"),
};

export { ServiceQuery, ServiceMutation };
