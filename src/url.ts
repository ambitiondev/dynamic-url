// Vendor
import qs from "qs";

// Types
import type { TParamsObject } from "../types";

export class DynamicURL {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  /**
   * Takes a query object and appends it to the URL as a query string.
   *
   * @param query - An object representing the query parameters.
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
  setQueryParams(query: Record<string, any>) {
    const queryString = qs.stringify(query, {
      skipNulls: true,
      encode: true,
    });

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
