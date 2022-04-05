# Leveraging Repository pattern + Entity in Angular 😎 <!-- omit in toc -->

<img src="https://raw.githubusercontent.com/androizer/ngx-crudx/main/crudx-logo.svg" alt="crudx" width="200px" align="right" />

[![npm version](https://badge.fury.io/js/ngx-crudx.svg)](https://badge.fury.io/js/ngx-crudx)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

> **NOTE: This DOC is under WIP**

`ngx-crudx` is a tool which help us to build highly scalable angular apps. Developers find Entity and Repository pattern familiar with ORM (eg. TypeORM), but certain mechanism was missing on the frontend architecture. In order to follow proper DRY principles, its better to use single Repository for each Entity to perform REST operations _(findAll, findOne, createOne etc.)_ using various configurations.

> `ngx-crudx` is highly influenced by [TypeORM](https://github.com/typeorm/typeorm) & [NestJS TypeORM](https://github.com/nestjs/typeorm) wrapper. 🙌

## Table of Contents <!-- omit in toc -->

- [Features](#features)
- [Installation](#installation)
- [Import the NgCrudxModule](#import-the-ngcrudxmodule)
  - [Sync Options](#sync-options)
  - [Async Options](#async-options)
- [Step-by-Step Guide](#step-by-step-guide)
  - [Create a Model](#create-a-model)
  - [Create an Entity](#create-an-entity)
  - [Create a Repository](#create-a-repository)
  - [Using the Repository](#using-the-repository)
- [@Entity API's](#entity-apis)
  - [path](#path)
  - [name?](#name)
  - [transform?](#transform)
  - [qs?](#qs)
  - [routes?](#routes)
- [Repository API](#repository-api)
  - [findAll](#findall)
  - [findOne](#findone)
  - [createOne](#createone)
  - [updateOne](#updateone)
  - [replaceOne](#replaceone)
  - [deleteOne](#deleteone)
- [Custom Repository](#custom-repository)
  - [Extra Routes](#extra-routes)
- [HttpsRequestOptions API's](#httpsrequestoptions-apis)
  - [params?](#params)
  - [pathParams?](#pathparams)
  - [transform?](#transform-1)
- [Known Issues](#known-issues)
- [Contributions](#contributions)
  - [Commit Message Format](#commit-message-format)
- [License](#license)

## Features

- Single codebase, yet different Repository for entity. Hence, DRY followed. 😀
- Annotate Entity model with `@Entity` decorator to add extra metadata.
- Add support for **Custom Repository**.
- Support for multiple micro-services _(URL bindings)_ as multiple connections.
- Ability to **transform** ([Adapter](https://en.wikipedia.org/wiki/Adapter_pattern)) **body** and/or **response payload** on the fly with easy configuration.
- Engineered an **interceptor** for query params (both at entity level and as well as individual route level).
- Produced code is performant, flexible, clean and maintainable.
- Follows all possible best practices.

## Installation

via npm:

```shell
npm install ngx-crudx
```

or yarn:

```shell
yarn add ngx-crudx
```

## Import the NgCrudxModule

### Sync Options

For monolith architecture, a single API server url is needed.

```typescript
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { NgCrudxModule } from "ngx-crudx";

@NgModule({
  imports: [
    BrowserModule,
    NgCrudxModule.forRoot({
      basePath: "http://localhost:3000",
      name: "DEFAULT", // Optional and defaults to DEFAULT
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

For micro-services architecture, multiple API server url can be configured.

```typescript
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { NgCrudxModule } from "ngx-crudx";

@NgModule({
  imports: [
    BrowserModule,
    NgCrudxModule.forRoot([
      {
        basePath: "http://localhost:3001/auth-service",
        name: "AUTH_SERVICE", // Required
      },
      {
        basePath: "http://localhost:3002/user-service",
        name: "USER_SERVICE", // Required
      },
    ]),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

### Async Options

For async root options, factory strategy can be used to provide configuration at runtime. The factory method **must always return `Promise<NgCrudxOptions>`**;

```typescript
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { NgCrudxModule } from "ngx-crudx";

import { EnvService } from "./services";

@NgModule({
  imports: [
    BrowserModule,
    NgCrudxModule.forRoot({
      useFactory: async (envService: EnvService) => {
        const envConfigs = await envService.getConfigs();
        // or if observable
        // const envConfigs = await envService.getConfigs().toPromise();
        return Promise.resolve({
          basePath: `${envConfigs.apiUrl}`,
          name: "DEFAULT",
        });
      },
      deps: [EnvService],
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

## Step-by-Step Guide

What are you expecting from `ngx-crudx`? First of all, you are expecting it will create repository service for you and find / insert / update / delete your entity without the pain of having to write lots of hardly maintainable services. This guide will show you how to set up `ngx-crudx` from scratch and make it do what you are expecting.

### Create a Model

Working with a library starts from creating model. How do you tell library to create a repository service? The answer is - through the models. Your models in your app are key to repository service.

For example, you have a `User` model:

```typescript
export class User {
  id: string;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}
```

### Create an Entity

_Entity_ is your model decorated by an @Entity decorator. You work with entities everywhere with **crudx**. You can load/insert/update/remove and perform other operations with them.

Let's make our `User` model as an entity:

```typescript
@Entity({
  path: "users",
})
export class User {
  id: string;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}
```

Now, this metadata is being annotated to the **User** entity and we'll be able to work with it anywhere in our app.

But wait, what would we get with this annotation and what this metadata stands for 🤨? Well, this metadata will act as configuration for the Repository service.

### Create a Repository

Well, we have annotate our model with `@Entity` decorator which will add the metadata to the model. But how would be deduce the Repository service? Well, _crudx_ provide a mechanism where repository service for each entity will be generated by DI of Angular, and with some pretty nice hooks.

Here is the example, on how to register the entity with the `crudx` **Module** and deduce a repository service for it.

```typescript
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgCrudxModule } from "ngx-crudx";

import { UserRoutingModule } from "./user-routing.module";
import { User } from "./user.model";

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    NgCrudxModule.forFeature([User]), // -> here we pass the model to the crudx module
  ],
})
export class UserModule {}
```

**Note:** If the model is not annotated with the @Entity decorator, then the `crudx` Module will throw an error stating:

> The entity passed named User is missing the @Entity() decorator. Make sure you have decorated the entity class with it.

### Using the Repository

Once the Entity is passed to the `crudx` Module, then we can Inject the **_Repository_** service as below:

```typescript
import { Component, Inject, OnInit } from "@angular/core";
import { Repository, RepoToken } from "ngx-crudx";
import { User } from "../user.model";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.scss"],
})
export class UserComponent {
  constructor(
    @Inject(RepoToken(User)) private readonly userRepo: Repository<User>,
  ) {}
}
```

## @Entity API's

Here are the detailed explanation for the `Entity` API's

### path

This property represents the path for entity on the backend API layer.

> e.g. 'users', 'posts', 'comments'

The path passed to the **forRoot** method on `ngx-crudx` will be base-path and the `path` property represents the logical location. **eg**. <http://localhost:3000/users>

### name?

The name of the connection name to which the current path is being appended to. Defaults to **DEFAULT**.

### transform?

The name applies as a `Adapter` layer. This will help in transforming the body (if any) before requesting and payload after receiving response. The value must be an instance of class or _**actual class\***_ which implements `Transform`.

> Note: Class based Adapter/Transform services is experimental at the moment. Lexical scoping issue **_might_** persist when referencing the model **_(which is annotated with the @RepoEntity)_** in the adapter service itself. In order to deal with lexical scoping, `NgxCrudx` will register the adapter/transform service itself into the `DI context` when the _Entity/Model_ annotated with the `@RepoEntity/@Entity` decorator is processed.\
> **Kindly don't register _Adapter/Transform_ services in the Module's `provider` array which are used by _Entity/Model_.**

```typescript
export type Transform<T = unknown | any, R = T> = {
  /**
   * Transform the Entity (T) type to arbitrary (which backend API expects) type R
   * @description Callback invoked when transforming body to
   * certain type which the backend API expects (R).
   */
  transformFromEntity: (data: T) => R;
  /**
   * Transform the payload received to Entity (T) type.
   * @description Callback invoked when transforming response
   * payload to type `Entity`.
   */
  transformToEntity: (resp: R) => T;
};
```

### qs?

Callback function which mutate/returns a new HttpParams object. The value of the param is the value passed as **params** to `HttpRequestOptions`.

> (params: AnyObject) => HttpParams | undefined;

### routes?

Object which consist of set of individual routes based configuration. For every Repository method, there is RouteOption type which is defined below.

```typescript
type RouteOptions = {
  /**
   * The path for the individual route
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
   * Repository method
   * @description If used as callback, then default mode is `extend`,
   * else builder params depends upon type of mode respectively.
   * @returns `HttpParams`
   */
  qs?:
    | RepoQueryBuilder
    | RepoQueryBuilder<"override">
    | ((params: HttpParams | AnyObject) => HttpParams);
};
```

- **path?**\
  This will override the path formed by `Repository` helper mechanism. This is useful in case your path doesn't match the criteria mentioned in the [Repository API](#repository-api) section.

- **transform?**\
  If you want to override the _default_ adapter/transformer of the model, then we can setup the adapter at the individual route level too. NOTE: This will always **override** the default transformer (if defined).

- **qs?**\
  If you want **extend** the functionality of _query params_ for individual route, pass a callback and return `HttpParams` from it. But if you want to **override** the default `qs` behavior (if defined), then pass the object type like below:

```typescript
{
  mode: 'extend' | 'override',
  builder<P = B>(params: P): HttpParams | undefined;
}
```

## Repository API

Certain methods definitions are present on the **Repository** class. These API are self-explanatory.

### findAll

```plaintext
GET /users
GET /posts
```

> findAll<R = T>(opts?: HttpRequestOptions<QueryParamType>): Observable<R extends T ? R[] : R>;

### findOne

```plaintext
GET /users/:userId
GET /users/:userId/posts/:postId
```

> findOne<R = T>(id: string | number, opts?: HttpRequestOptions<QueryParamType>): Observable<R>;\
> findOne<R = T>(opts: HttpRequestOptions<QueryParamType>): Observable<R>;

### createOne

```plaintext
POST /users
POST /users/:userId/posts
```

> createOne<R = T>(payload: AnyObject, opts?: HttpRequestOptions<QueryParamType>): Observable<R>;

### updateOne

```plaintext
PATCH /users/:userId
PATCH /users/:userId/posts/:postId
```

> updateOne<R = T>(id: string | number, body: Partial<R>, opts?: HttpRequestOptions<QueryParamType>): Observable<Partial<R>>;\
> updateOne<R = T>(body: Partial<R>,opts: HttpRequestOptions<QueryParamType>): Observable<Partial<R>>;

### replaceOne

```plaintext
PUT /users/:userId
PUT /users/userId/posts/:postId
```

> replaceOne<R = T>(id: string | number, body: R, opts?: HttpRequestOptions<QueryParamType>): Observable<Partial<R>>;\
> replaceOne<R = T>( body: R, opts: HttpRequestOptions<QueryParamType> ): Observable<Partial<R>>;

### deleteOne

```plaintext
DELETE /users/:userId
DELETE /users/:userId/posts/:postId
```

> deleteOne<R = any>(id: string | number, opts?: HttpRequestOptions<QueryParamType> ): Observable<R>;\
> deleteOne<R = any>(opts: HttpRequestOptions<QueryParamType>): Observable<R>;

## Custom Repository

There is a scenario where basic CRUD isn't just enough. You may need to add more operations to the Repository. Since every Entity have its own desired way to communicate, not all methods can be generic-fied. So to add your own custom behavior to the repository, there is `Custom Repository` for the rescue.

Here is how to define a **Custom Repository**:

```typescript
import { RepositoryMixin } from "ngx-crudx";

import { User } from "../user.model";

export class UserRepository extends RepositoryMixin(User) {
  constructor() {
    super();
  }

  findByName(name: string) {
    // business logic here.
  }
}
```

Now, instead of passing the Entity to the `ngx-crudx` Module, pass the repository class to the Module for DI to generate instance.

```typescript
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgCrudxModule } from "ngx-crudx";

import { UserRepository } from "./repositories";
import { UserRoutingModule } from "./user-routing.module";

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    NgCrudxModule.forFeature([UserRepository]), // -> here we pass the custom repository to the module
  ],
})
export class UserModule {}
```

### Extra Routes

The need of custom repositories depends upon extra operations other than basic CRUD. Hence, to incorporate such endpoints which cannot be generic-fied and need different endpoints and other features of `crudx` to work in conjunction, there is a `request` method which exposes basic params to create a new request using various options (`HttpRequestOptions`).

```typescript
import { RepositoryMixin } from "ngx-crudx";

import { User } from "../user.model";
import { CountTransform } from "../user-count.transform.ts";

export class UserRepository extends RepositoryMixin(User) {
  constructor() {
    super();
  }

  totalCount() {
    return super.request("get", "users/count", { transform: CountTransform });
  }
}
```

Signature for request method is as follow:

> request<R = any>( method: HttpMethod, path: HttpRequestOptions["path"], opts?: HttpRequestBaseOptions & Pick<HttpRequestOptions, "transform" | "pathParams"> ): Observable<R>;

## HttpsRequestOptions API's

Many of the properties provided by the `HttpClient's` **_RequestOptions_** share the same signature. The ones, which share the same signature are listed below:

```typescript
interface HttpRequestBaseOptions {
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
```

Here are the ones which are supported by library:

```typescript
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
  /**
   * @summary Class Model or it's instance that will help in modifying the
   * payload **in (getting response) and out (sending request).**
   * Providing `"none"` as value will skip the transformation at all levels.
   */
  transform?: "none" | RepoEntityOptions["transform"];
};
```

### params?

This is the object which takes key-value pair. The type is defined by the `Repository` class via _Generics_.

> ```typescript
> export class Repository<T = unknown, QueryParamType = AnyObject> {}
> ```

The second generic type is supported for frameworks like [@nestjsx/crud-request](https://github.com/nestjsx/crud/wiki/Requests#frontend-usage) for better type interpolation.

### pathParams?

This is the key-value pair object which replaces the _path params_ from the `path` property in the `@Entity` decorator.

Here is the example.

```typescript
@Entity({
  path: 'users/:userId/photos',
})
export class Photo {
  ...
}
```

The `userId` will be replaced at runtime via **pathParam** property.

```typescript
@Component({
  selector: "app-photo",
  templateUrl: "./photo.component.html",
  styleUrls: ["./photo.component.scss"],
})
export class PhotoComponent implements OnInit {
  constructor(
    @Inject(RepoToken(Photo)) private readonly photoRepo: Repository<Photo>,
  ) {}

  ngOnInit() {
    this.photoRepo
      .findAll({
        pathParams: {
          userId: "123",
        },
      })
      .subscribe((resp) => {
        // do something with resp
      });
  }
}
```

### transform?

The ability to transform the request/response payload can be done at runtime. There may be such cases where **_transformations are no longer needed for a particular endpoint_** but it's transformation adapter is configured at decorator (`@Entity`) level. Hence, this property will help us to control the default behavior.

```typescript
@Component({
  selector: "app-photo",
  templateUrl: "./photo.component.html",
  styleUrls: ["./photo.component.scss"],
})
export class PhotoComponent implements OnInit {
  constructor(
    @Inject(RepoToken(Photo)) private readonly photoRepo: Repository<Photo>,
  ) {}

  ngOnInit() {
    this.photoRepo
      .findAll({
        transform: "none", // <-- this will simply disable the transformation logic
      })
      .subscribe((resp) => {
        // do something with resp
      });
  }
}
```

## Known Issues

Class based Adapter/Transformer services is experimental at the moment. Lexical scoping issue **_might_** persist when referencing the model **_(which is annotated with the @RepoEntity)_** in the adapter service itself. In order to deal with lexical scoping, `NgxCrudx` will register the adapter/transformer service itself into the `DI context` when the _Entity/Model_ annotated with the `@RepoEntity/@Entity` decorator is processed.

> **Kindly don't register _Adapter/Transformer_ services in the Module's `provider` array which are used by _Entity/Model_.**

```typescript
// user.entity.ts
@RepoEntity({
  path: "user",
  routes: {
    createOne: {
      transform: UserAdapter
    }
  }
})
class User {
  ...
}

// user.adapter.ts
import {User} from './entities';

@Injectable()
export class UserAdapter implements Transform<User> {
  transformFromEntity(data: User) {
    return classToPlain(data);
  }

  transformToEntity(resp: AnyObject) {
    return plainToClass(User, resp);
  }
}

// user.module.ts
@NgModule({
  imports: [CommonModuleNgCrudxModule.forFeature([User])],
  declarations: [UserComponent],
  providers: [UserAdapter], // ❌ don't register adapter service.
})
export class UserModule {}
```

## Contributions

If you like this library or found any bug/typo and want to contribute, PR's are most welcomed.

For major changes, please open an issue first to discuss what you would like to change.

Our commit messages are formatted according to [Conventional Commits](https://conventionalcommits.org/), hence this repository has [commitizen](https://github.com/commitizen/cz-cli) support enabled. Commitizen can help you generate your commit messages automatically.

And to use it, simply call git commit. The tool will help you generate a commit message that follows the below guidelines.

### Commit Message Format

Each commit message consists of a header, a body and a footer. The header has a special format that includes a type, an optional scope and a subject:

```plaintext
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

## License

[MIT](/LICENSE)
