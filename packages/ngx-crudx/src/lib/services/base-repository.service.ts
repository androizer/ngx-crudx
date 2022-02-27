import { HttpClient } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { getMetadataStorage } from "../internals";
import { AbstractRepository } from "./abstract-repository.service";

import type { AnyObject, HttpRequestOptions } from "../types";

/**
 * Repository is supposed to work with your entity objects.
 * Find entities, create, update, delete, etc.
 */
@Injectable()
export class Repository<
  T = unknown,
  QueryParamType = AnyObject,
> extends AbstractRepository<T, QueryParamType> {
  #httpService: HttpClient;
  constructor(
    entity: Function,
    _injector: Injector = getMetadataStorage.getInjector(),
  ) {
    super(entity, _injector);
    this.#httpService = _injector.get(HttpClient);
  }

  /**
   * Find all entities that match the given options or conditions.
   */
  findAll<R = T>(
    opts: HttpRequestOptions<QueryParamType> = {},
  ): Observable<R extends T ? R[] : R> {
    const url = super.getUrl(opts, "findAll");
    const params = super.adaptQueryParam(opts, "findAll");
    return this.#httpService
      .get<R[]>(url.toString(), { ...opts, params })
      .pipe(map((resp) => super.adaptToModel(resp, "findAll")));
  }

  /**
   * Finds first entity that matches given conditions.
   */
  findOne<R = T>(
    idOrOpts: string | number | HttpRequestOptions,
    opts: HttpRequestOptions = {},
  ): Observable<R> {
    if (typeof idOrOpts === "object") {
      opts = idOrOpts;
    }
    const url = super.getUrl(opts, "findOne", idOrOpts);
    const params = super.adaptQueryParam(opts, "findOne");
    return this.#httpService
      .get<R>(url.toString(), { ...opts, params })
      .pipe(map((resp) => super.adaptToModel(resp, "findOne")));
  }

  /**
   * Creates a new entity instance.
   * Can copy properties from the given object into new entities.
   * @description ```
   * fetch(url, body, {method: 'POST', ...opts})
   * ```
   */
  createOne<R = T>(payload, opts: HttpRequestOptions = {}): Observable<R> {
    const url = super.getUrl(opts, "createOne");
    const params = super.adaptQueryParam(opts, "createOne");
    payload = super.adaptFromModel(payload, "createOne");
    return this.#httpService
      .post<R>(url.toString(), payload, { ...opts, params })
      .pipe(map((resp) => super.adaptToModel(resp, "createOne")));
  }

  /**
   * Updates entity partially. Entity can be found by a given conditions.
   * @description ```
   * fetch(url, body, {method: 'PATCH', ...opts})
   * ```
   */
  updateOne<R = T>(
    idOrBody: string | number | Partial<R>,
    bodyOrOpts: Partial<R> | HttpRequestOptions = {},
    opts: HttpRequestOptions = {},
  ): Observable<Partial<R>> {
    let body;
    if (typeof idOrBody === "object") {
      body = idOrBody;
      opts = bodyOrOpts;
    } else {
      body = bodyOrOpts;
    }
    const url = super.getUrl(opts, "updateOne", idOrBody);
    const params = super.adaptQueryParam(opts, "updateOne");
    body = super.adaptFromModel(body, "updateOne");
    return this.#httpService
      .patch<R>(url.toString(), body, { ...opts, params })
      .pipe(map((resp) => super.adaptToModel(resp, "updateOne")));
  }

  /**
   * Updates entity completely. Entity can be found by a given conditions.
   * @description ```
   * fetch(url, body, {method: 'PUT', ...opts})
   * ```
   */
  replaceOne<R = T>(
    idOrBody: string | number | R,
    bodyOrOpts: R | HttpRequestOptions = {},
    opts: HttpRequestOptions = {},
  ): Observable<Partial<R>> {
    let body;
    if (typeof idOrBody === "object") {
      body = idOrBody;
      opts = bodyOrOpts;
    } else {
      body = bodyOrOpts;
    }
    const url = super.getUrl(opts, "replaceOne", idOrBody);
    const params = super.adaptQueryParam(opts, "replaceOne");
    body = super.adaptFromModel(body, "replaceOne");
    return this.#httpService
      .put<R>(url.toString(), body, { ...opts, params })
      .pipe(map((resp) => super.adaptToModel(resp, "replaceOne")));
  }

  /**
   * Deletes entities by a given criteria.
   */
  deleteOne<R = any>(
    idOrOpts: string | number | HttpRequestOptions,
    opts: HttpRequestOptions = {},
  ): Observable<R> {
    if (typeof idOrOpts === "object") {
      opts = idOrOpts;
    }
    const url = super.getUrl(opts, "deleteOne", idOrOpts);
    const params = super.adaptQueryParam(opts, "deleteOne");
    return this.#httpService.delete<R>(url.toString(), { ...opts, params });
  }
}
