import { getMetadataStorage } from "../internals";
import { RepoModel } from "../models";
import { Repository } from "../services";
import { AnyObject, Constructable } from "../types";
import { isEntityValid } from "../utils";

type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * Repository is supposed to work with your entity objects.
 * Find entities, create, update, delete, etc.
 */
function RepositoryMixin<TBase extends Constructor, QueryParamType = AnyObject>(
  _entity: TBase,
) {
  if (isEntityValid(_entity)) {
    getMetadataStorage.setRepoModel(_entity as Constructable<RepoModel>);
  }
  const Model = class extends Repository {
    constructor() {
      super(_entity);
    }
  };
  return Model as unknown as Constructor<
    Repository<InstanceType<TBase>, QueryParamType>
  >;
}

export { RepositoryMixin };
