import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { Injector, ModuleWithProviders, NgModule } from "@angular/core";

import { getMetadataStorage } from "./internals";
import { RepoModelOrSchema } from "./models";
import { REPO_ENTITY_DEFAULT_OPTIONS } from "./tokens";
import { RepoEntityOptions } from "./types";
import { getRepoProviders } from "./utils";

@NgModule({
  imports: [CommonModule, HttpClientModule],
})
export class NgxModRepoModule {
  constructor(injector: Injector) {
    getMetadataStorage.setInjector(injector);
  }

  static forRoot(
    opts: RepoEntityOptions
  ): ModuleWithProviders<NgxModRepoModule> {
    return {
      ngModule: NgxModRepoModule,
      providers: [
        {
          provide: REPO_ENTITY_DEFAULT_OPTIONS,
          useValue: opts,
        },
      ],
    };
  }

  static forFeature(
    entities: RepoModelOrSchema[]
  ): ModuleWithProviders<NgxModRepoModule> {
    const providers = getRepoProviders(entities);
    return {
      ngModule: NgxModRepoModule,
      providers,
    };
  }
}
