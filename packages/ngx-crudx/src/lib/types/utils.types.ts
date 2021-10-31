import { HttpContext, HttpHeaders, HttpParams } from "@angular/common/http";

import { RepoEntityDecoratorOptions } from "./repo-decorator-options.types";
import { RepoEntityOptions } from "./repo-options.types";

export type AnyObject = Record<string, any>;

interface HttpRequestBaseOptions {
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
  "params"
> & {
  /**
   * Query params
   */
  params?: QueryParamType;
  /**
   * Path params
   */
  pathParams?: Record<string, string>;
};

export type AdaptQueryParamsInput = {
  rootOpts: RepoEntityOptions;
  decoratorOpts: RepoEntityDecoratorOptions;
  httpOpts: HttpRequestOptions;
};

export type Adapter<T = unknown | any, R = T> = {
  /**
   * Transform the Entity (T) type to arbitrary (which backend API expects) type R
   * @description Callback invoked when transforming body to
   * certain type which the backend API expects (R).
   */
  adaptFromModel: (data: T) => R;
  /**
   * Transform the payload received to Entity (T) type.
   * @description Callback invoked when transforming response
   * payload to type `Entity`.
   */
  adaptToModel: (resp: R) => T;
};

export type Constructable<T> = {
  new (...args: any): T;
};

export type RepoQueryBuilder<
  M = "extend",
  B = M extends "extend" ? HttpParams : AnyObject
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
