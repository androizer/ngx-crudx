import { HttpClient } from "@angular/common/http";
import { Injector, Provider } from "@angular/core";

import { RepoToken } from "./repo-entity.utils";
import { RepoModel, RepoModelOrSchema } from "../models";
import { EntityRepository } from "../services";
import { REPO_ENTITY_DEFAULT_OPTIONS } from "../tokens";
import { Constructable } from "../types";

function getRepoProviders(entities: RepoModelOrSchema[]): Provider[] {
  return entities.reduce((acc, entity) => {
    const instance = new (entity as Constructable<RepoModel>)();
    acc.push({
      provide: RepoToken(entity),
      useFactory: (httpClient: HttpClient, injector: Injector) => {
        const rootOpts = injector.get(REPO_ENTITY_DEFAULT_OPTIONS);
        return new EntityRepository(httpClient, rootOpts, instance);
      },
      deps: [HttpClient, Injector],
    });
    return acc;
  }, [] as Provider[]);
}

export { getRepoProviders };
