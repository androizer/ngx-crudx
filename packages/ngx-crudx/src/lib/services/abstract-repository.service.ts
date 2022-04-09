import { HttpParams } from "@angular/common/http";
import { Directive, Injector } from "@angular/core";
import { isArray, isEmpty, isFunction, isNil, isObject } from "lodash-es";
import { Observable } from "rxjs";

import { ConnectionNameNotFound } from "../exceptions";
import { getMetadataStorage } from "../internals";
import { RepoModel } from "../models";
import { REPO_ENTITY_DEFAULT_OPTIONS } from "../tokens";
import { isEntityValid } from "../utils";

import type {
  Transform,
  AnyObject,
  Constructable,
  HttpRequestOptions,
  RepoEntityOptions,
  NgCrudxOptions,
  RepoQueryBuilder,
  HttpRequestBaseOptions,
  IRepository,
} from "../types";
const DEFAULT_CONNECTION_NAME = "DEFAULT";

@Directive()
export abstract class AbstractRepository<T, QueryParamType = AnyObject>
  implements IRepository<T, QueryParamType>
{
  #repoOpts: RepoEntityOptions;
  #rootOpts: NgCrudxOptions;
  constructor(
    _entity: Function,
    private readonly _injector: Injector = getMetadataStorage.getInjector(),
  ) {
    if (isEntityValid(_entity)) {
      this.#rootOpts = this._injector.get(REPO_ENTITY_DEFAULT_OPTIONS);
      this.#repoOpts =
        new (_entity as Constructable<RepoModel>)().getRepositoryOptionsForEntity();
    }
  }

  abstract findAll<R = T>(
    opts?: HttpRequestOptions<QueryParamType>,
  ): Observable<R extends T ? R[] : R>;
  abstract findOne<R = T>(
    id: string | number,
    opts?: HttpRequestOptions<QueryParamType>,
  ): Observable<R>;
  abstract findOne<R = T>(
    opts: HttpRequestOptions<QueryParamType>,
  ): Observable<R>;
  abstract createOne<R = T>(
    payload: AnyObject,
    opts?: HttpRequestOptions<QueryParamType>,
  ): Observable<R>;
  abstract updateOne<R = T>(
    id: string | number,
    body: Partial<R>,
    opts?: HttpRequestOptions<QueryParamType>,
  ): Observable<Partial<R>>;
  abstract updateOne<R = T>(
    body: Partial<R>,
    opts: HttpRequestOptions<QueryParamType>,
  ): Observable<Partial<R>>;
  abstract replaceOne<R = T>(
    id: string | number,
    body: R,
    opts?: HttpRequestOptions<QueryParamType>,
  ): Observable<Partial<R>>;
  abstract replaceOne<R = T>(
    body: R,
    opts: HttpRequestOptions<QueryParamType>,
  ): Observable<Partial<R>>;
  abstract deleteOne<R = any>(
    id: string | number,
    opts?: HttpRequestOptions<QueryParamType>,
  ): Observable<R>;
  abstract deleteOne<R = any>(
    opts: HttpRequestOptions<QueryParamType>,
  ): Observable<R>;
  protected abstract request<R = any>(
    method: string,
    path: string,
    opts?: HttpRequestBaseOptions &
      Pick<HttpRequestOptions<AnyObject>, "transform" | "pathParams">,
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
    key: keyof RepoEntityOptions["routes"] | "request",
    optionalPath?,
  ): URL {
    const connectionName = this.#repoOpts.name ?? DEFAULT_CONNECTION_NAME;
    let optionFound;
    if (isArray(this.#rootOpts)) {
      optionFound = this.#rootOpts.find(
        (item) => item.name.toLowerCase() === connectionName.toLowerCase(),
      );
      if (!optionFound) {
        throw new ConnectionNameNotFound(connectionName);
      }
    } else if (isObject(this.#rootOpts) && !isEmpty(this.#rootOpts)) {
      // If user supplied different connection name and not equal to default,
      // then throw ConnectionNameNotFound error.
      optionFound = this.#rootOpts;
      if (
        connectionName.toLowerCase() !==
        (optionFound.name ?? DEFAULT_CONNECTION_NAME).toLowerCase()
      ) {
        throw new ConnectionNameNotFound(connectionName);
      }
    }
    const route =
      httpOpts.path ??
      this.#repoOpts.routes?.[key]?.path ??
      (optionalPath && !isObject(optionalPath)
        ? `${this.#repoOpts.path}/${optionalPath}`
        : `${this.#repoOpts.path}`);

    const url = new URL(`./${route}`, `${optionFound.basePath}/`);
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
  protected transformQueryParam(
    httpOpts: HttpRequestOptions,
    key: keyof RepoEntityOptions["routes"],
  ): HttpParams | undefined {
    const decoQs = this.#repoOpts.qs;
    const routeQs = this.#repoOpts.routes?.[key]?.qs;
    let params: HttpParams;
    // if route qs is object and not empty, then check for mode
    if (isObject(routeQs) && !isEmpty(routeQs)) {
      if ((routeQs as RepoQueryBuilder<"override">).mode === "override") {
        return (routeQs as RepoQueryBuilder<"override">).builder(
          httpOpts.params,
        );
      } else {
        params = decoQs?.(httpOpts.params);
        return (routeQs as RepoQueryBuilder)?.builder(
          params ?? httpOpts.params,
        );
      }
    }
    return decoQs?.(httpOpts.params);
  }

  /**
   * Callback which will transform the model (body)
   * after receiving the response.
   */
  protected transformToEntity(
    httpOpts: HttpRequestOptions,
    resPayload: any,
    key: keyof RepoEntityOptions["routes"] | "request",
  ) {
    if (["findAll", "request"].includes(key)) {
      if (isObject(resPayload)) {
        const { dataKey } = this.#repoOpts.routes?.[key] ?? {};
        if (dataKey) {
          resPayload = resPayload[dataKey] ?? [];
        }
      }
      if (isArray(resPayload)) {
        return resPayload.reduce((acc, item) => {
          const data = this._fetchAdapterAndTransform(
            "to",
            httpOpts,
            item,
            key,
          );
          if (!isNil(data)) {
            acc.push(data);
          }
          return acc;
        }, []);
      }
    }
    return this._fetchAdapterAndTransform("to", httpOpts, resPayload, key);
  }

  /**
   * Callback which will transform the model (body)
   * before sending the request.
   */
  protected transformFromEntity(
    httpOpts: HttpRequestOptions,
    reqPayload: any,
    key: keyof RepoEntityOptions["routes"] | "request",
  ) {
    return this._fetchAdapterAndTransform("from", httpOpts, reqPayload, key);
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
    httpOpts: HttpRequestOptions,
    payload: any,
    key: keyof RepoEntityOptions["routes"] | "request",
  ) {
    let data = payload;
    const httpAdapter = httpOpts.transform;
    const decoAdapter = this.#repoOpts.transform;
    const decoRouteAdapter = this.#repoOpts.routes?.[key]?.transform;

    if (httpAdapter) {
      // If httpAdapter have "none" value, then no need to transform payload
      // This condition can't be merged with the above condition since we don't
      // want the above condition to be falsy due to "none" value and fallback
      // to else if. This is intended to work like this.
      if (httpAdapter !== "none") {
        data = this._adaptToFromModel(mode, payload, httpAdapter);
      }
    } else if (decoRouteAdapter) {
      data = this._adaptToFromModel(mode, payload, decoRouteAdapter);
    } else if (decoAdapter) {
      data = this._adaptToFromModel(mode, payload, decoAdapter);
    }
    return data;
  }

  /**
   * @param mode 'to' | 'from'
   * @param payload
   * @param adapter ITransform (this is not exported as of yet)
   * @returns
   */
  private _adaptToFromModel(
    mode: "to" | "from",
    payload: unknown,
    adapter: unknown,
  ) {
    let data = payload;
    if (isFunction(adapter)) {
      const instance = this._injector.get(adapter);
      data =
        mode === "to"
          ? instance.transformToEntity(payload)
          : instance.transformFromEntity(payload);
    } else if (isObject(adapter) && !isEmpty(adapter)) {
      data =
        mode === "to"
          ? (adapter as Transform).transformToEntity?.(payload) ?? data
          : (adapter as Transform).transformFromEntity?.(payload) ?? data;
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
    url: string,
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
