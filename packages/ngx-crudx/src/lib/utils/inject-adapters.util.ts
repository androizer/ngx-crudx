import { Provider } from "@angular/core";
import { isEmpty, isFunction, isObject } from "lodash-es";

import { getMetadataStorage } from "../internals";
import { RepoModel } from "../models";
import { Constructable } from "../types";
import { isEntityValid } from "./validate-entity.util";

function _injectAdapter(
  providers: Provider[],
  entity: Constructable<RepoModel>,
) {
  if (isEntityValid(entity)) {
    const isAdapterExist = (
      funcs: Constructable<Function>[],
      adapter: Function,
    ): boolean => funcs.some((func) => func.name === adapter.name);

    const paths = (obj = {}): Constructable<Function>[] => {
      return Object.entries(obj).reduce((acc, [key, value]) => {
        if (key === "transform" && isFunction(value)) {
          const allowTransformDI = obj["allowTransformDI"] ?? true;
          if (allowTransformDI) {
            const found = isAdapterExist(acc, value);
            if (!found) {
              return acc.concat(value);
            }
          }
        } else if (!isEmpty(value) && isObject(value)) {
          return acc.concat(paths(value));
        }
        return acc;
      }, []);
    };

    const repoOpts = new entity().getRepositoryOptionsForEntity();
    const adaptersArr = paths(repoOpts);
    adaptersArr.forEach((adapter) =>
      providers.push({
        provide: adapter,
        useClass: adapter,
      }),
    );
    // remove the repo model once its adapters (if any) are added to providers array
    if (getMetadataStorage.hasRepoModel(repoOpts.id)) {
      getMetadataStorage.removeRepoModel(repoOpts.id);
    }
  }
}

export { _injectAdapter };
