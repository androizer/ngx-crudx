import { InjectionToken } from "@angular/core";

import { RepoEntityOptions } from "../types";

export const REPO_ENTITY_DEFAULT_OPTIONS =
  new InjectionToken<RepoEntityOptions>("REPO_ENTITY_DEFAULT_OPTIONS");
