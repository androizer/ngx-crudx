type NgCrudxBaseOptions = {
  /**
   * Absolute path for the REST service where CRUD ops
   * will be taking place
   * @example 'https://abc.xyz/api'
   */
  basePath: string;
  /**
   * Unique connection name to differ from others if mentioned
   * @description If no value is provided, then default value
   * is DEFAULT **_(case insensitive)_**
   * @default ```DEFAULT```
   */
  name?: string;
};

export type NgCrudxOptions =
  | NgCrudxBaseOptions
  | Required<NgCrudxBaseOptions>[];

export type NgCrudxAsyncOptions = {
  useFactory: (...args: any[]) => Promise<NgCrudxOptions>;
  deps?: any[];
};
