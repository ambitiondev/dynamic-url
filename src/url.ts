// Types
import type { TParamsObject, IStringifyQueryOptions } from "../types";

// Defaults
const MAX_DEPTH_DEFAULT = 5;
const SEPARATOR_DEFAULT = "&";
const PREFIX_DEFAULT = "";
const SKIPP_NULLS_DEFAULT = true;

function stringify(
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  obj: Record<string, any>,
  options?: IStringifyQueryOptions
): string {
  const {
    maxDepth = MAX_DEPTH_DEFAULT,
    prefix = PREFIX_DEFAULT,
    separator = SEPARATOR_DEFAULT,
    skipNulls = SKIPP_NULLS_DEFAULT,
  } = options || {};

  const stringifyRecursive = (
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    obj: Record<string, any>,
    prefix: string,
    depth = 0
  ): string => {
    const result = Object.entries(obj).reduce((queryString, [key, value]) => {
      // Handle skipNulls option
      if (skipNulls && (value === null || value === undefined)) {
        return queryString;
      }

      // Build the unencoded key path first
      const keyPath = prefix ? `${prefix}[${key}]` : key;

      // Check if value is an object and we haven't exceeded max depth
      if (typeof value === "object" && value !== null && depth < maxDepth) {
        // Pass unencoded keyPath as prefix to prevent double encoding in recursive calls
        const nestedQuery = stringifyRecursive(value, keyPath, depth + 1);

        // Only append if nestedQuery has content
        if (!nestedQuery) {
          return queryString;
        }

        return queryString
          ? `${queryString}${separator}${nestedQuery}`
          : nestedQuery;
      } else {
        // Encode only once at the leaf level
        const encodedKey = encodeURIComponent(keyPath);
        const encodedValue =
          typeof value === "object" && value !== null
            ? ""
            : encodeURIComponent(value);
        const keyValueString = `${encodedKey}=${encodedValue}`;
        return queryString
          ? `${queryString}${separator}${keyValueString}`
          : keyValueString;
      }
    }, "");

    return result;
  };

  return stringifyRecursive(obj, prefix);
}

export class DynamicURL {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  /**
   * Takes a query object and appends it to the URL as a query string.
   *
   * @param query - An object representing the query parameters.
   * @param options - Options for stringifying the query parameters.
   * @param options.prefix - Prefix for the query parameters (default: "").
   * @param options.maxDepth - Maximum depth for nested objects (default: 5).
   * @param options.separator - Separator for the query parameters (default: "&").
   * @param options.skipNulls - Whether to skip null or undefined values (default: true).
   * @see {@link IStringifyQueryOptions}
   * @returns {DynamicURL}
   *
   * @example
   * ```ts
   * const url = new DynamicURL("https://example.com");
   * url.setQueryParams({ citizen: "robespierre", hero: "ironman" });
   * console.log(url.resolve()); // "https://example.com?citizen=robespierre&hero=ironman"
   * ```
   */
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  setQueryParams(query: Record<string, any>, options?: IStringifyQueryOptions) {
    const queryString = stringify(query, options);

    if (queryString) {
      this.url = `${this.url}?${queryString}`;
    }

    return this;
  }

  /**
   * Replaces route parameters in the URL with the provided values.
   *
   * @param {TParamsObject | string} replaceValue - An object or string to replace the route parameters.
   *
   * @see {@link TParamsObject}
   * @returns {DynamicURL}
   *
   * @example
   * ```ts
   * const url = new DynamicURL("https://example.com/{citizen}/{hero}");
   * url.setRouteParams({ citizen: "robespierre", hero: "ironman" });
   * console.log(url.resolve()); // "https://example.com/robespierre/ironman"
   * ```
   */
  setRouteParams(replaceValue: TParamsObject | string) {
    if (typeof replaceValue === "string") {
      this.url = this.url.replace(/ *\{[^)]*\} */g, replaceValue);
      return this;
    }

    this.url = this.url.replace(/\{([^}]+)\}/g, (match, key) => {
      if (Object.prototype.hasOwnProperty.call(replaceValue, key)) {
        const value = replaceValue[key];
        return String(value);
      }
      return match;
    });

    return this;
  }

  /**
   * Resolves and returns the final URL as a string.
   *
   * @example
   * ```ts
   * const url = new DynamicURL("https://example.com/{citizen}/{hero}");
   * url.setRouteParams({ citizen: "robespierre", hero: "ironman" });
   *
   * // Resolve the final URL
   * console.log(url.resolve()); // "https://example.com/robespierre/ironman"
   * ```
   *
   * @returns {string}
   */
  resolve() {
    return this.url;
  }
}
