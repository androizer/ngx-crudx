import { HttpParams } from "@angular/common/http";

import {
  Adapter,
  AnyObject,
  Constructable,
  RepoQueryBuilder,
} from "./utils.types";

export type RepoEntityDecoratorOptions = {
  /**
   * Relative path of the entity (in accordance with basePath)
   * as per the REST spec.
   * @example `/users`
   */
  path: string;
  /**
   * Unique connection name on which the basePath is prepended
   * to `path` property.
   * @description If no value is provided, then fallback to
   * DEFAULT **_(case insensitive)_**
   * @default ```DEFAULT```
   */
  name?: string;
  /**
   * Additional routes options to configure individual routes and
   * its respective configuration
   */
  routes?: Partial<RoutesOptions>;
  /**
   * Class Model or it's instance that will help in modifying the
   * payload **in (getting response) and out (sending request).**
   */
  adapter?: IAdapter;
  /**
   * Callback for mutating the query params passed via
   * Repo method
   * @description If used as callback, then default mode
   * is `extend`
   * @returns `HttpParams`
   */
  qs?: (params: AnyObject) => HttpParams | undefined;
};

type RoutesOptions = {
  findAll: Omit<RouteOptions, "adapter"> & {
    adapter: Pick<Adapter<any[]>, "adaptToModel">;
  };
  findOne: Omit<RouteOptions, "adapter"> & {
    adapter: Pick<Adapter, "adaptToModel">;
  };
  createOne: RouteOptions;
  updateOne: RouteOptions;
  replaceOne: RouteOptions;
  deleteOne: RouteOptions;
};

type RouteOptions = {
  /**
   * The path for the individual route (if it's not
   * aligned as per se REST standards for any reason)
   */
  path?: string;
  /**
   * Route specific model adapter.
   * @description Always **_override_** the
   * default adapter defined in repo options.
   */
  adapter?: IAdapter;
  /**
   * Callback/QueryBuilder for mutating the query params passed via
   * Repo method
   * @description If used as callback, then default mode is `extend`,
   * else builder params depends upon type of mode respectively.
   * @returns `HttpParams`
   */
  qs?:
    | RepoQueryBuilder
    | RepoQueryBuilder<"override">
    | ((params: HttpParams) => HttpParams);
};

type IAdapter =
  | Constructable<Adapter>
  | (
      | Required<Adapter>
      | (Pick<Adapter, "adaptFromModel"> &
          Partial<Pick<Adapter, "adaptToModel">>)
      | (Pick<Adapter, "adaptToModel"> &
          Partial<Pick<Adapter, "adaptFromModel">>)
    );
