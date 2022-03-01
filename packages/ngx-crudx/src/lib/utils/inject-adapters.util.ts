import { Provider } from "@angular/core";
import { isEmpty, isFunction, isObject } from "lodash-es";

import { RepoEntityDecoratorMissingException } from "../exceptions";
import { getMetadataStorage } from "../internals";
import { RepoModel } from "../models";
import { Constructable } from "../types";

function _injectAdapter(
  providers: Provider[],
  entity: Constructable<RepoModel>,
) {
  if (Object.getPrototypeOf(entity).name !== RepoModel.name) {
    throw new RepoEntityDecoratorMissingException(entity);
  }
  const isAdapterExist = (
    funcs: Constructable<Function>[],
    adapter: Function,
  ): boolean => funcs.some((func) => func.name === adapter.name);
  const paths = (obj = {}): Constructable<Function>[] => {
    return Object.entries(obj).reduce((product, [key, value]) => {
      if (key === "transform" && isFunction(value)) {
        const found = isAdapterExist(product, value);
        if (!found) {
          return product.concat(value);
        }
      } else if (!isEmpty(value) && isObject(value)) {
        return product.concat(paths(value));
      }
      return product;
    }, []);
  };
  const repoOpts = new entity()._repoOpts;
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

export { _injectAdapter };
