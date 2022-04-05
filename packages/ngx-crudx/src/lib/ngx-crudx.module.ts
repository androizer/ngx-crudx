import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import {
  APP_INITIALIZER,
  Injector,
  ModuleWithProviders,
  NgModule,
} from "@angular/core";

import { getMetadataStorage } from "./internals";
import { RepoModelOrSchema } from "./models";
import { REPO_ENTITY_DEFAULT_OPTIONS } from "./tokens";
import { NgCrudxAsyncOptions, NgCrudxOptions } from "./types";
import { getRepoProviders } from "./utils";

@NgModule({
  imports: [CommonModule, HttpClientModule],
})
export class NgCrudxModule {
  constructor(injector: Injector) {
    getMetadataStorage.setInjector(injector);
  }

  static forRoot(opts: NgCrudxOptions): ModuleWithProviders<NgCrudxModule> {
    return {
      ngModule: NgCrudxModule,
      providers: [
        {
          provide: REPO_ENTITY_DEFAULT_OPTIONS,
          useValue: opts,
        },
      ],
    };
  }

  static forRootAsync(
    opts: NgCrudxAsyncOptions,
  ): ModuleWithProviders<NgCrudxModule> {
    return {
      ngModule: NgCrudxModule,
      providers: [
        {
          provide: APP_INITIALIZER,
          useFactory: (...args) => {
            return async () => {
              const crudxOpts = await opts.useFactory(...args);
              getMetadataStorage.setAsyncCrudOptions(crudxOpts);
            };
          },
          deps: opts.deps,
          multi: true,
        },
        {
          provide: REPO_ENTITY_DEFAULT_OPTIONS,
          useFactory: () => {
            const crudxOpts = getMetadataStorage.getAsyncCrudOptions();
            getMetadataStorage.setAsyncCrudOptions(undefined);
            return crudxOpts;
          },
        },
      ],
    };
  }

  static forFeature(
    entities: RepoModelOrSchema[],
  ): ModuleWithProviders<NgCrudxModule> {
    const providers = getRepoProviders(entities);
    return {
      ngModule: NgCrudxModule,
      providers,
    };
  }
}
