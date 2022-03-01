import { RepoEntityOptions, RepoEntityDecoratorOptions } from "../types";
import { uuid_v4 } from "../utils";

/**
 * RepoEntity/Entity decorator for class based entity/model functions
 * @param opts `RepoEntityDecoratorOptions`
 */
function RepoEntity(opts: RepoEntityDecoratorOptions): ClassDecorator {
  return function (fn: Function) {
    const _opts = opts as RepoEntityOptions;
    // Unique ID for `Internal Token Injection`
    // This `ID` should be unique out of all
    // the entities used for `RepoModel` options
    _opts.id = uuid_v4();
    class RepoModel {
      constructor(public _repoOpts: RepoEntityOptions) {}
    }
    RepoModel.prototype._repoOpts = _opts;
    Object.setPrototypeOf(fn.prototype, RepoModel.prototype);
    Object.setPrototypeOf(fn, RepoModel);
  };
}

export { RepoEntity, RepoEntity as Entity };
