import { getMetadataStorage } from "../internals";
import { RepoModel } from "../models";
import { Repository } from "../services";
import { Constructable } from "../types";

type Constructor = new (...args: any[]) => {};

/**
 * Repository is supposed to work with your entity objects.
 * Find entities, create, update, delete, etc.
 */
function RepositoryMixin<TBase extends Constructor>(_entity: TBase) {
  getMetadataStorage.setRepoModel(_entity as Constructable<RepoModel>);
  return class extends Repository<InstanceType<TBase>> {
    constructor() {
      super(_entity);
    }
  };
}

export { RepositoryMixin };
