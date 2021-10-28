import { Observable } from "rxjs";

import { AnyObject, HttpRequestOptions } from "./utils.types";

export interface IRepository<T, QueryParamType = AnyObject> {
  findAll<R = T>(
    opts?: HttpRequestOptions<QueryParamType>
  ): Observable<R extends T ? R[] : R>;

  findOne<R = T>(
    id: string | number,
    opts?: HttpRequestOptions<QueryParamType>
  ): Observable<R>;
  findOne<R = T>(opts: HttpRequestOptions<QueryParamType>): Observable<R>;

  createOne<R = T>(
    payload: AnyObject,
    opts?: HttpRequestOptions<QueryParamType>
  ): Observable<R>;

  updateOne<R = T>(
    id: string | number,
    body: Partial<R>,
    opts?: HttpRequestOptions<QueryParamType>
  ): Observable<Partial<R>>;
  updateOne<R = T>(
    body: Partial<R>,
    opts: HttpRequestOptions<QueryParamType>
  ): Observable<Partial<R>>;

  replaceOne<R = T>(
    id: string | number,
    body: R,
    opts?: HttpRequestOptions<QueryParamType>
  ): Observable<Partial<R>>;
  replaceOne<R = T>(
    body: R,
    opts: HttpRequestOptions<QueryParamType>
  ): Observable<Partial<R>>;

  deleteOne<R = any>(
    id: string | number,
    opts?: HttpRequestOptions<QueryParamType>
  ): Observable<R>;
  deleteOne<R = any>(opts: HttpRequestOptions<QueryParamType>): Observable<R>;
}
