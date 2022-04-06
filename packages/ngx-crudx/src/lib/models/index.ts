import { RepoEntityOptions } from "../types";

/**
 * Repo Model
 * @description Don't use this interface directly.
 * This interface is meant for internal use only.
 */
export interface RepoModel {
  getRepositoryOptionsForEntity?(): RepoEntityOptions;
}

export type RepoModelOrSchema = Function;
