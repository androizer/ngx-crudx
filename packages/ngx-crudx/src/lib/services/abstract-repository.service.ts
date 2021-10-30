import { HttpParams } from "@angular/common/http";
import { Directive, Injector } from "@angular/core";
import { isArray, isEmpty, isFunction, isObject } from "lodash";
import { Observable } from "rxjs";

import {
  ConnectionNameNotFound,
  RepoEntityDecoratorMissingException,
} from "../exceptions";
import { getMetadataStorage } from "../internals";
import { RepoModel } from "../models";
import { REPO_ENTITY_DEFAULT_OPTIONS } from "../tokens";
import {
  Adapter,
  AnyObject,
  Constructable,
  HttpRequestOptions,
  IRepository,
  RepoEntityDecoratorOptions,
  RepoEntityOptions,
  RepoQueryBuilder,
} from "../types";

const DEFAULT_CONNECTION_NAME = "DEFAULT";

@Directive()
export abstract class AbstractRepository<T, QueryParamType = AnyObject>
  implements IRepository<T, QueryParamType>
{
  protected _repoOpts: RepoEntityDecoratorOptions;
  protected _rootOpts: RepoEntityOptions;
  constructor(
    _entity: Function,
    _injector: Injector = getMetadataStorage.getInjector()
  ) {
    if (Object.getPrototypeOf(_entity).name !== RepoModel.name) {
      throw new RepoEntityDecoratorMissingException(_entity);
    }
    this._rootOpts = _injector.get(REPO_ENTITY_DEFAULT_OPTIONS);
    this._repoOpts = new (_entity as Constructable<RepoModel>)()._repoOpts;
  }

  abstract findAll<R = T>(
    opts?: HttpRequestOptions<QueryParamType>
  ): Observable<R extends T ? R[] : R>;
  abstract findOne<R = T>(
    id: string | number,
    opts?: HttpRequestOptions<QueryParamType>
  ): Observable<R>;
  abstract findOne<R = T>(
    opts: HttpRequestOptions<QueryParamType>
  ): Observable<R>;
  abstract createOne<R = T>(
    payload: AnyObject,
    opts?: HttpRequestOptions<QueryParamType>
  ): Observable<R>;
  abstract updateOne<R = T>(
    id: string | number,
    body: Partial<R>,
    opts?: HttpRequestOptions<QueryParamType>
  ): Observable<Partial<R>>;
  abstract updateOne<R = T>(
    body: Partial<R>,
    opts: HttpRequestOptions<QueryParamType>
  ): Observable<Partial<R>>;
  abstract replaceOne<R = T>(
    id: string | number,
    body: R,
    opts?: HttpRequestOptions<QueryParamType>
  ): Observable<Partial<R>>;
  abstract replaceOne<R = T>(
    body: R,
    opts: HttpRequestOptions<QueryParamType>
  ): Observable<Partial<R>>;
  abstract deleteOne<R = any>(
    id: string | number,
    opts?: HttpRequestOptions<QueryParamType>
  ): Observable<R>;
  abstract deleteOne<R = any>(
    opts: HttpRequestOptions<QueryParamType>
  ): Observable<R>;

  /**
   * Transform url based on of basePath on either
   * root/feature option or decorator option
   * @param key `keyof RoutesOption`
   * @param optionalPath extra path to append
   * @returns `string`
   */
  protected getUrl(
    httpOpts: HttpRequestOptions,
    key: keyof RepoEntityDecoratorOptions["routes"],
    optionalPath?
  ): URL {
    const connectionName = this._repoOpts.name ?? DEFAULT_CONNECTION_NAME;
    let optionFound;
    if (isArray(this._rootOpts)) {
      optionFound = this._rootOpts.find(
        (item) =>
          item.name.toLowerCase() === DEFAULT_CONNECTION_NAME.toLowerCase()
      );
      if (!optionFound) {
        throw new ConnectionNameNotFound(connectionName);
      }
    } else if (isObject(this._rootOpts) && !isEmpty(this._rootOpts)) {
      // If user supplied different connection name and not equal to default,
      // then throw ConnectionNameNotFound error.
      optionFound = this._rootOpts;
      if (
        connectionName.toLowerCase() !==
        (optionFound.name ?? DEFAULT_CONNECTION_NAME).toLowerCase()
      ) {
        throw new ConnectionNameNotFound(connectionName);
      }
    }
    const route =
      this._repoOpts.routes?.[key]?.path ??
      (optionalPath && !isObject(optionalPath)
        ? `${this._repoOpts.path}/${optionalPath}`
        : `${this._repoOpts.path}`);
    const url = new URL(route, optionFound.basePath);
    // replace the url content with path params if exists
    url.href = this._replacePathParams(httpOpts, url.href);
    return url;
  }

  /**
   * Callback for mutating query params object on-demand
   * @description When the `qs` prop is present in repo
   * option, then the transformation if being done from
   * the callback. Route specific `qs` adapter will either
   * **_extend_** the adapting functionality, or **_override_**
   * the one defined in repo options.
   * @param httpOpts `HttpRequestOptions`
   * @returns `HttpParams`
   */
  protected adaptQueryParam(
    httpOpts: HttpRequestOptions,
    key: keyof RepoEntityDecoratorOptions["routes"]
  ): HttpParams | undefined {
    let decoQs = this._repoOpts.qs;
    let routeQs = this._repoOpts.routes?.[key]?.qs;
    let params: HttpParams;
    // if route qs is object and not empty, then check for mode
    if (isObject(routeQs) && !isEmpty(routeQs)) {
      if ((routeQs as RepoQueryBuilder<"override">).mode === "override") {
        return (routeQs as RepoQueryBuilder<"override">).builder(
          httpOpts.params
        );
      } else {
        params = decoQs?.(httpOpts.params);
        return (routeQs as RepoQueryBuilder)?.builder(
          params ?? httpOpts.params
        );
      }
    }
    return decoQs?.(httpOpts.params);
  }

  /**
   * Callback which will transform the model (body)
   * after receiving the response.
   */
  protected adaptToModel(
    resp: any,
    key: keyof RepoEntityDecoratorOptions["routes"]
  ) {
    return this._fetchAdapterAndTransform("to", resp, key);
  }

  /**
   * Callback which will transform the model (body)
   * before sending the request.
   */
  protected adaptFromModel(
    model: any,
    key: keyof RepoEntityDecoratorOptions["routes"]
  ) {
    return this._fetchAdapterAndTransform("from", model, key);
  }

  /**
   * Fetch the appropriate adapter from repo entity options
   * @description If the adapter (class/object) is found on
   * specific route property, it will take precedence over
   * to adapter found on the repo entity decorator option.
   * If none of the adapter is found, then no transformation
   * take place.
   * @param mode 'to' | 'from'
   * @param payload
   * @param key `keyof RepoEntityDecoratorOptions["routes"]`
   * @returns
   */
  private _fetchAdapterAndTransform(
    mode: "to" | "from",
    payload: any,
    key: keyof RepoEntityDecoratorOptions["routes"]
  ) {
    let data = payload;
    const decoAdapter = this._repoOpts.adapter;
    const decoRouteAdapter = this._repoOpts.routes?.[key]?.adapter;
    if (decoRouteAdapter) {
      data = this._adaptToFromModel(mode, payload, decoRouteAdapter);
    } else if (decoAdapter) {
      data = this._adaptToFromModel(mode, payload, decoAdapter);
    }
    return data;
  }

  /**
   * @param mode 'to' | 'from'
   * @param payload
   * @param adapter IAdapter (this is not exported as of yet)
   * @returns
   */
  private _adaptToFromModel(
    mode: "to" | "from",
    payload: unknown,
    adapter: unknown
  ) {
    let data = payload;
    if (isFunction(adapter)) {
      const instance = new (adapter as unknown as Constructable<Adapter>)();
      data =
        mode === "to"
          ? instance.adaptToModel(payload)
          : instance.adaptFromModel(payload);
    } else if (isObject(adapter) && !isEmpty(adapter)) {
      data =
        mode === "to"
          ? (adapter as Adapter).adaptToModel(payload)
          : (adapter as Adapter).adaptFromModel(payload);
    }
    return data;
  }

  /**
   * Parse the URL by replacing path keys with values
   * from pathParams map
   * @param httpOpts
   * @param url string
   * @returns string url
   */
  private _replacePathParams(
    httpOpts: HttpRequestOptions,
    url: string
  ): string {
    const { pathParams } = httpOpts;
    if (isObject(pathParams) && !isEmpty(pathParams)) {
      Object.entries(pathParams).forEach(([key, value]) => {
        url = url.replace(`:${key}`, value);
        url = url.replace(`{${key}}`, value);
      });
    }
    return url;
  }
}
