import { InjectionToken } from "@angular/core";

import { NgCrudxOptions } from "../types";

export const REPO_ENTITY_DEFAULT_OPTIONS = new InjectionToken<NgCrudxOptions>(
  "REPO_ENTITY_DEFAULT_OPTIONS",
);
