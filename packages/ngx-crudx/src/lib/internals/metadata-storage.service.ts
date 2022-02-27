import { Injector } from "@angular/core";
import { RepoModel } from "../models";
import { Constructable, RepoEntityOptions, uuid } from "../types";

class MetadataStorageService {
  // private variables
  #injector: Injector;
  #repoModelMap = new Map<uuid, Constructable<RepoModel>>();

  setInjector(injector: Injector) {
    this.#injector = injector;
  }

  getInjector(): Injector {
    return this.#injector;
  }

  setRepoModel(_repoModel: Constructable<RepoModel>) {
    const _opts = new _repoModel()._repoOpts;
    this.#repoModelMap.set((_opts as any).id, _repoModel);
  }

  hasRepoModel(id: uuid) {
    return this.#repoModelMap.has(id);
  }

  removeRepoModel(id: uuid) {
    this.#repoModelMap.delete(id);
  }

  /**
   * Returns all the Entity models which derives `Custom Repository` pattern.
   * @returns
   */
  getRepoModels(): Constructable<RepoModel>[] {
    return Array.from(this.#repoModelMap, ([_, _repoModel]) => _repoModel);
  }
}

const getMetadataStorage = new MetadataStorageService();

export { getMetadataStorage };
