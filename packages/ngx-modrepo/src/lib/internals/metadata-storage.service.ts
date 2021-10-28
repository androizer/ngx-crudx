import { Injector } from "@angular/core";

import { AnyObject } from "../types";

class MetadataStorageService {
  // private variables
  #metadata: AnyObject;
  #injector: Injector;

  set(obj: AnyObject) {
    this.#metadata = obj;
  }

  get(): AnyObject {
    return this.#metadata;
  }

  setInjector(injector: Injector) {
    this.#injector = injector;
  }

  getInjector(): Injector {
    return this.#injector;
  }
}

const getMetadataStorage = new MetadataStorageService();

export { getMetadataStorage };
