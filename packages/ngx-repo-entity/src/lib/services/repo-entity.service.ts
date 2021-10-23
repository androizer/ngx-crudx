import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Optional } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { RepoModel } from "../models";
import { REPO_ENTITY_DEFAULT_OPTIONS } from "../tokens";
import { AnyObject, HttpRequestOptions, RepoEntityOptions } from "../types";
import { Repository as AbstractRepository } from "./abstract-repo.service";

@Injectable()
export class EntityRepository<
  T,
  QueryParamType = AnyObject
> extends AbstractRepository<T, QueryParamType> {
  constructor(
    private readonly _httpService: HttpClient,
    @Inject(REPO_ENTITY_DEFAULT_OPTIONS)
    public readonly _rootOpts: RepoEntityOptions,
    @Optional() public readonly _model: RepoModel
  ) {
    super(_rootOpts, _model);
  }

  findAll<R = T>(
    opts: HttpRequestOptions<QueryParamType> = {}
  ): Observable<R extends T ? R[] : R> {
    const url = super.getUrl(opts, "findAll");
    let params = super.adaptQueryParam(opts, "findAll");
    return this._httpService
      .get<R[]>(url.toString(), { ...opts, params })
      .pipe(map((resp) => super.adaptToModel(resp, "findAll")));
  }

  findOne<R = T>(
    idOrOpts: string | number | HttpRequestOptions,
    opts: HttpRequestOptions = {}
  ): Observable<R> {
    if (typeof idOrOpts === "object") {
      opts = idOrOpts;
    }
    const url = super.getUrl(opts, "findOne", idOrOpts);
    const params = super.adaptQueryParam(opts, "findOne");
    return this._httpService
      .get<R>(url.toString(), { ...opts, params })
      .pipe(map((resp) => super.adaptToModel(resp, "findOne")));
  }

  createOne<R = T>(payload, opts: HttpRequestOptions = {}): Observable<R> {
    const url = super.getUrl(opts, "createOne");
    const params = super.adaptQueryParam(opts, "createOne");
    payload = super.adaptFromModel(payload, "createOne");
    return this._httpService
      .post<R>(url.toString(), payload, { ...opts, params })
      .pipe(map((resp) => super.adaptToModel(resp, "createOne")));
  }

  updateOne<R = T>(
    idOrBody: string | number | Partial<R>,
    bodyOrOpts: Partial<R> | HttpRequestOptions = {},
    opts: HttpRequestOptions = {}
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
    return this._httpService
      .patch<R>(url.toString(), body, { ...opts, params })
      .pipe(map((resp) => super.adaptToModel(resp, "updateOne")));
  }

  replaceOne<R = T>(
    idOrBody: string | number | R,
    bodyOrOpts: R | HttpRequestOptions = {},
    opts: HttpRequestOptions = {}
  ): Observable<Partial<R>> {
    let body;
    if (typeof idOrBody === "object") {
      body = idOrBody;
      opts = bodyOrOpts;
    } else {
      body = bodyOrOpts;
    }
    const url = super.getUrl(opts, "replaceOne");
    const params = super.adaptQueryParam(opts, "replaceOne");
    body = super.adaptFromModel(body, "replaceOne");
    return this._httpService
      .put<R>(url.toString(), body, { ...opts, params })
      .pipe(map((resp) => super.adaptToModel(resp, "replaceOne")));
  }

  deleteOne<R = any>(
    idOrOpts: string | number | HttpRequestOptions,
    opts: HttpRequestOptions = {}
  ): Observable<R> {
    if (typeof idOrOpts === "object") {
      opts = idOrOpts;
    }
    const url = super.getUrl(opts, "deleteOne", idOrOpts);
    const params = super.adaptQueryParam(opts, "deleteOne");
    return this._httpService.delete<R>(url.toString(), { ...opts, params });
  }
}
