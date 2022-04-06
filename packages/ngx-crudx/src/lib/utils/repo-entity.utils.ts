import { CircularDependencyException } from "../exceptions";
import { RepoModel, RepoModelOrSchema } from "../models";
import { Constructable } from "../types";
import { isEntityValid } from "./validate-entity.util";

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
  if (isEntityValid(entity)) {
    const _repoOpts =
      new (entity as Constructable<RepoModel>)().getRepositoryOptionsForEntity();
    const token = `${(_repoOpts as any).id}${entity.name}Repository`;
    return token;
  }
  return null;
}

export { getRepoEntityToken as RepoToken };
