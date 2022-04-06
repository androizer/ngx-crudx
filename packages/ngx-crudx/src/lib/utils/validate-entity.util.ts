import { isFunction } from "lodash-es";

import { RepoEntityDecoratorMissingException } from "../exceptions";

/**
 * Validate if Entity is annotated with `@Entity/@RepoEntity` decorator
 * @param _entity {Function} Function
 * @returns {boolean} boolean
 */
function isEntityValid(_entity: Function): boolean {
  if (!isFunction(_entity)) {
    throw new Error(
      `Expected Entity to be Function Constructor, but got as ${typeof _entity}}`,
    );
  }
  if (!isFunction(_entity.prototype.getRepositoryOptionsForEntity)) {
    throw new RepoEntityDecoratorMissingException(_entity);
  }
  return true;
}

export { isEntityValid };
