import { Inject } from "@angular/core";

import { RepoModelOrSchema } from "../models";
import { RepoToken } from "../utils";

/**
 * Work In Progress
 * @param entity
 * @returns `Inject` Decorator
 */
export const InjectRepository: (
  entity: RepoModelOrSchema,
) => ParameterDecorator = (entity: RepoModelOrSchema) =>
  Inject(RepoToken(entity));
