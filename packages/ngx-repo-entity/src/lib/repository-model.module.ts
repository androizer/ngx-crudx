import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { ModuleWithProviders, NgModule } from "@angular/core";

import { RepoModelOrSchema } from "./models";
import { Repository } from "./services";
import { REPO_ENTITY_DEFAULT_OPTIONS } from "./tokens";
import { RepoEntityOptions } from "./types";
import { getRepoProviders } from "./utils";

@NgModule({
  imports: [CommonModule, HttpClientModule],
})
export class NgxRepoEntityModule {
  static forRoot(
    opts: RepoEntityOptions
  ): ModuleWithProviders<NgxRepoEntityModule> {
    return {
      ngModule: NgxRepoEntityModule,
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
  ): ModuleWithProviders<NgxRepoEntityModule> {
    const providers = getRepoProviders(entities);
    return {
      ngModule: NgxRepoEntityModule,
      providers,
    };
  }
}
