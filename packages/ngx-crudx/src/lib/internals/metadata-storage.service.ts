import { Injector } from "@angular/core";

class MetadataStorageService {
  // private variables
  #injector: Injector;

  setInjector(injector: Injector) {
    this.#injector = injector;
  }

  getInjector(): Injector {
    return this.#injector;
  }
}

const getMetadataStorage = new MetadataStorageService();

export { getMetadataStorage };
