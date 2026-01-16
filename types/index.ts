export type TParamsObject = Record<string, string | number | boolean>;

export interface IStringifyQueryOptions {
  /**
   * Prefix for the query parameters.
   * @default ""
   */
  prefix?: string;
  /**
   * Separator for the query parameters.
   * @default "&"
   */
  separator?: string;
  /**
   * Whether to skip null or undefined values.
   * @default true
   */
  skipNulls?: boolean;
  /**
   * Maximum depth for nested objects.
   * @default 5
   */
  maxDepth?: number;
}
