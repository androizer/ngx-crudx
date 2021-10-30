import { Injector, Provider } from "@angular/core";

import { RepoModel, RepoModelOrSchema } from "../models";
import { Repository } from "../services";
import { Constructable } from "../types";
import { RepoToken } from "./repo-entity.utils";

function getRepoProviders(entities: RepoModelOrSchema[]): Provider[] {
  return entities.reduce((acc, entity: Constructable<RepoModel>) => {
    if (entity.prototype instanceof Repository) {
      acc.push({
        provide: entity,
        useClass: entity,
      });
    } else {
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
}

export { getRepoProviders };
