import {
  CircularDependencyException,
  RepoEntityDecoratorMissingException,
} from "../exceptions";
import { RepoModel, RepoModelOrSchema } from "../models";
import { Constructable } from "../types";

/**
 * Utility function which will help to decode injection token
 * for the provided entity
 * @param entity
 * @returns Injection Token
 */
function getRepoEntityToken(entity: RepoModelOrSchema): string {
  if (!entity) {
    throw new CircularDependencyException("@RepoEntity()");
  }
  if (
    typeof entity === "function" &&
    !(entity.prototype instanceof RepoModel)
  ) {
    throw new RepoEntityDecoratorMissingException(entity);
  }
  const _repoOpts = new (entity as Constructable<RepoModel>)()._repoOpts;
  return `${(_repoOpts as any).id}${(entity as Function).name}Repository`;
}

export { getRepoEntityToken as RepoToken };
