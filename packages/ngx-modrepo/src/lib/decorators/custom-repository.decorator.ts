/**
 * Used to declare a class as a custom repository.
 * Custom repository can manage some specific entity or just be generic.
 * Custom repository optionally can extend Repository.
 */
function CustomRepository(entity: Function): ClassDecorator {
  return function (fn: Function) {
    fn.prototype.__metaModel = entity;
  };
}

export { CustomRepository };
