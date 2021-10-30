export class CircularDependencyException extends Error {
  constructor(context?: string) {
    const ctx = context ? ` inside ${context}` : ``;
    super(
      `A circular dependency has been detected${ctx}. Please, make sure that each side of a bidirectional relationships are decorated with "forwardRef()". Also, try to eliminate barrel files because they can lead to an unexpected behavior too.`
    );
  }
}

/**
 * This exception class denotes that the entity which
 * is passed in as forFeature options is missing the
 * `@RepoEntity()` decorator onto it.
 */
export class RepoEntityDecoratorMissingException extends Error {
  constructor(ctx: Function) {
    super(
      `The entity passed named ${ctx.name} is missing the @RepoEntity() decorator. Make sure you have decorated the entity class with it.`
    );
  }
}

export class ConnectionNameNotFound extends Error {
  constructor(connName: string) {
    super(
      `Connection name ${connName} not found! Make sure the connection name is present in root options.`
    );
  }
}
