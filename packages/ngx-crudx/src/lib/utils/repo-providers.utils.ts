import { Injector, Provider } from "@angular/core";
import { getMetadataStorage } from "../internals";

import { RepoModel, RepoModelOrSchema } from "../models";
import { Repository } from "../services";
import { Constructable } from "../types";
import { _injectAdapter } from "./inject-adapters.util";
import { RepoToken } from "./repo-entity.utils";

function getRepoProviders(entities: RepoModelOrSchema[]): Provider[] {
  const providers = entities.reduce((acc, entity: Constructable<RepoModel>) => {
    if (entity.prototype instanceof Repository) {
      acc.push({
        provide: entity,
        useClass: entity,
      });
    } else {
      _injectAdapter(acc, entity);
      acc.push({
        provide: RepoToken(entity),
        useFactory: (injector: Injector) => {
          return new Repository(entity, injector);
        },
        deps: [Injector],
      });
    }
    return acc;
  }, [] as Provider[]);
  getMetadataStorage
    .getRepoModels()
    .forEach((_repoModel) => _injectAdapter(providers, _repoModel));
  return providers;
}

export { getRepoProviders };
