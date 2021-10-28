import { RepoEntityDecoratorOptions } from "../types";

/**
 * Repo Model
 * @description Don't use this model directly. This class is meant for internal use.
 */
export class RepoModel {
  constructor(public _repoOpts?: RepoEntityDecoratorOptions) {}
}

export type RepoModelOrSchema = Function;
