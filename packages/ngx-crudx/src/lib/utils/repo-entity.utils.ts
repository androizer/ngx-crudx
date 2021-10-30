import { isFunction } from "lodash";

import {
  CircularDependencyException,
  RepoEntityDecoratorMissingException,
} from "../exceptions";
import { RepoModel, RepoModelOrSchema } from "../models";
import { Constructable } from "../types";

/**
 * Utility function which will help to inject the repository
 * by decoding the injection token for the provided entity.
 * @param entity
 * @returns Injection Token
 */
function getRepoEntityToken(entity: RepoModelOrSchema): string {
  if (!entity) {
    throw new CircularDependencyException("@RepoEntity()");
  }
  if (
    isFunction(entity) &&
    Object.getPrototypeOf(entity).name !== RepoModel.name
  ) {
    throw new RepoEntityDecoratorMissingException(entity);
  }
  const _repoOpts = new (entity as Constructable<RepoModel>)()._repoOpts;
  const token = `${(_repoOpts as any).id}${entity.name}Repository`;
  return token;
}

export { getRepoEntityToken as RepoToken };
