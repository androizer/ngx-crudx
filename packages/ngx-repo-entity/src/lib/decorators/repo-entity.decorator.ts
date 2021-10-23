import { RepoModel } from "../models";
import { RepoEntityDecoratorOptions } from "../types";
import { uuid_v4 } from "../utils/";

/**
 * RepoEntity/Entity decorator for class based entity/model functions
 * @param opts `RepoEntityDecoratorOptions`
 */
function RepoEntity(opts: RepoEntityDecoratorOptions) {
  return function (fn: Function) {
    // Unique ID for `Internal Token Injection`
    // This `ID` should be unique out of all
    // the entities used for `RepoModel` options
    (opts as any).id = uuid_v4();
    RepoModel.prototype._repoOpts = opts;
    Object.setPrototypeOf(fn.prototype, RepoModel.prototype);
    Object.setPrototypeOf(fn, RepoModel);
  };
}

export { RepoEntity, RepoEntity as Entity };
