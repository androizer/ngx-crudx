import { Injector, Provider } from "@angular/core";

import { getMetadataStorage } from "../internals";
import { RepoModel, RepoModelOrSchema } from "../models";
import { Repository } from "../services";
import { Constructable } from "../types";
import { RepoToken } from "./repo-entity.utils";

function getRepoProviders(entities: RepoModelOrSchema[]): Provider[] {
  return entities.reduce((acc, entity: Constructable<RepoModel>) => {
    if (entity.prototype instanceof Repository) {
      const __metaModel = (entity as Function).prototype.__metaModel;
      getMetadataStorage.set({
        model: __metaModel,
        instance: new __metaModel(),
      });
      acc.push({
        provide: entity,
        useClass: entity,
      });
    } else {
      getMetadataStorage.set({ model: entity, instance: new entity() });
      acc.push({
        provide: RepoToken(entity),
        useFactory: (injector: Injector) => {
          return new Repository(injector);
        },
        deps: [Injector],
      });
    }
    return acc;
  }, [] as Provider[]);
}

export { getRepoProviders };
