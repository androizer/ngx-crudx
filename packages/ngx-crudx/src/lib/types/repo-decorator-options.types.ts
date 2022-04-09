import { HttpParams } from "@angular/common/http";

import {
  AnyObject,
  Constructable,
  RepoQueryBuilder,
  Transform,
} from "./utils.types";

export type RepoEntityOptions = {
  id: string;
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
  transform?: ITransform;
  /**
   * Callback for mutating the query params passed via
   * Repo method
   * @returns `HttpParams`
   */
  qs?: (params: AnyObject) => HttpParams | undefined;
} & AllowTransformDI;

export type RepoEntityDecoratorOptions = Omit<RepoEntityOptions, "id">;

type RoutesOptions = {
  findAll: Omit<RouteOptions, "transform"> & {
    transform?: Pick<Transform<any[]>, "transformToEntity">;
    /**
     * The key at which the data `(findAll array response)` is
     * persisted and it extracted when transforming.
     * @example
     * ```ts
     * // response from API
     * {
     *   total: 22,
     *   data: [...],
     * }
     *
     * // add prop "data"
     * {dataKey: "data"}
     * ```
     */
    dataKey?: string;
  };
  findOne: Omit<RouteOptions, "transform"> & {
    transform?: Pick<Transform, "transformToEntity">;
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
   * Route specific model adapter/transformer.
   * @description Always **_override_** the
   * default adapter defined in repo options.
   */
  transform?: ITransform;
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
    | ((params: HttpParams | AnyObject) => HttpParams);
} & AllowTransformDI;

/**
 * @experimental Class based Adapter is `experimental`
 * at the moment. `Lexical scoping` issue persist when
 * referencing the model _(which is annotated with
 * the `@RepoEntity/@Entity`)_ in the adapter class itself.
 */
type ITransform =
  | Constructable<Transform>
  | (
      | Required<Transform>
      | (Pick<Transform, "transformFromEntity"> &
          Partial<Pick<Transform, "transformToEntity">>)
      | (Pick<Transform, "transformToEntity"> &
          Partial<Pick<Transform, "transformFromEntity">>)
    );

type AllowTransformDI = {
  /**
   * Predicate value to **allow/restrict** `transform` value
   * registration with `Injector`.
   * @description If the value of the `transform` is class based
   * then it will be registered into the DI context from within the _crudx_.\
   * If the class is simply POJO which doesn't needs to be registered
   * with DI context, then `allowTransformDI` prop comes in handy.
   * @example
   * ```typescript
   * // This will not register the class provided
   * // as transform value to DI context.
   * allowTransformDI: false,
   * transform: UserTransform
   * ```
   * @link https://github.com/androizer/ngx-crudx#known-issues
   *
   * @default true
   */
  allowTransformDI?: boolean;
};
