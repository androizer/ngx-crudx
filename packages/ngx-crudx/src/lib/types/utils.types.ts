import { HttpContext, HttpHeaders, HttpParams } from "@angular/common/http";

import { RepoEntityOptions } from "./repo-decorator-options.types";
import { NgCrudxOptions } from "./repo-options.types";

export type AnyObject = Record<string, any>;
export type uuid = string;

export interface HttpRequestBaseOptions {
  body?: any;
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      };
  context?: HttpContext;
  observe?: "body";
  params?:
    | HttpParams
    | {
        [param: string]:
          | string
          | number
          | boolean
          | ReadonlyArray<string | number | boolean>;
      };
  reportProgress?: boolean;
  responseType?: "json";
  withCredentials?: boolean;
}

export type HttpRequestOptions<QueryParamType = AnyObject> = Omit<
  HttpRequestBaseOptions,
  "body" | "params"
> & {
  /**
   * Query params
   */
  params?: QueryParamType;
  /**
   * Path params
   */
  pathParams?: Record<string, string>;
  /**
   * @summary Class Model or it's instance that will help in modifying the
   * payload **in (getting response) and out (sending request).**
   * Providing `"none"` as value will skip the transformation at all levels.
   */
  transform?: "none" | RepoEntityOptions["transform"];
} & Partial<Pick<RepoEntityOptions, "path">>;

export type AdaptQueryParamsInput = {
  rootOpts: NgCrudxOptions;
  decoratorOpts: RepoEntityOptions;
  httpOpts: HttpRequestOptions;
};

export type Transform<T = unknown | any, R = T> = {
  /**
   * Transform the Entity `T` type to arbitrary (which backend API expects) type `R`
   * @description Callback invoked when transforming body to
   * certain type which the backend API expects (R).
   */
  transformFromEntity(data: T): R;
  /**
   * Transform the payload received to instance of Entity type `T`.
   * @description Callback invoked when transforming response
   * payload to type `Entity`.
   */
  transformToEntity(resp: R): T;
};

export type Constructable<T> = {
  new (...args: any): T;
};

export type RepoQueryBuilder<
  M = "extend",
  B = M extends "extend" ? HttpParams : AnyObject,
> = {
  /**
   * Mode of operation
   * @default ```extend```
   */
  mode?: M;
  /**
   * Transformer function
   */
  builder<P = B>(params: P): HttpParams | undefined;
};

/**
 * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
 */
export type HttpMethod =
  | "get"
  | "post"
  | "patch"
  | "put"
  | "delete"
  | "options"
  | "head"
  | "connect"
  | "trace";
