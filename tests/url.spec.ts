// Vendor
import { describe, expect, test } from "vitest";

// Util
import { DynamicURL } from "../src/url";

describe("DynamicURL", () => {
  test("should set simple query params correctly", () => {
    const url = new DynamicURL("https://example.com");
    url.setQueryParams({ citizen: "robespierre", hero: "ironman" });

    expect(url.resolve()).toBe(
      "https://example.com?citizen=robespierre&hero=ironman"
    );
  });

  test("should set deeply nested query params correctly", () => {
    const url = new DynamicURL("https://example.com");
    url.setQueryParams({ citizen: "robespierre", marvel: { hero: "ironman" } });

    expect(url.resolve()).toBe(
      "https://example.com?citizen=robespierre&marvel%5Bhero%5D=ironman"
    );
  });

  test("should set array query params correctly", () => {
    const url = new DynamicURL("https://example.com");
    url.setQueryParams({ citizen: "robespierre", heroes: ["ironman", "thor"] });

    expect(url.resolve()).toBe(
      "https://example.com?citizen=robespierre&heroes%5B0%5D=ironman&heroes%5B1%5D=thor"
    );
  });

  test("should not add query string when all values are null or undefined", () => {
    const url = new DynamicURL("https://example.com");
    url.setQueryParams({ citizen: null, hero: undefined });

    expect(url.resolve()).toBe("https://example.com");
  });

  test("should set route params correctly when given a string", () => {
    const url = new DynamicURL("https://example.com/{citizen}/{hero}");
    url.setRouteParams("robespierre/ironman");

    expect(url.resolve()).toBe("https://example.com/robespierre/ironman");
  });

  test("should set route params correctly when given an object", () => {
    const url = new DynamicURL("https://example.com/{citizen}/{hero}");
    url.setRouteParams({ citizen: "robespierre", hero: "ironman" });

    expect(url.resolve()).toBe("https://example.com/robespierre/ironman");
  });

  test("should ignore route params that are not in the URL", () => {
    const url = new DynamicURL("https://example.com/{citizen}/{hero}");
    url.setRouteParams({
      citizen: "robespierre",
      hero: "ironman",
      extra: "korg",
    });

    expect(url.resolve()).toBe("https://example.com/robespierre/ironman");
  });

  test("converts a number value to string in route params", () => {
    const url = new DynamicURL("https://example.com/{citizen}/{heroesCount}");
    url.setRouteParams({
      citizen: "robespierre",
      heroesCount: 12,
    });

    expect(url.resolve()).toBe("https://example.com/robespierre/12");
  });

  test("converts a boolean value to string in route params", () => {
    const url = new DynamicURL(
      "https://example.com/{citizen}/{wasThanosRight}"
    );
    url.setRouteParams({
      citizen: "robespierre",
      wasThanosRight: true,
    });

    expect(url.resolve()).toBe("https://example.com/robespierre/true");
  });

  test("should keep route params that are not provided in the object", () => {
    const url = new DynamicURL("https://example.com/{citizen}/{hero}");
    url.setRouteParams({ citizen: "robespierre" });

    expect(url.resolve()).toBe("https://example.com/robespierre/{hero}");
  });

  test("should respect maxDepth option and stop at specified depth", () => {
    const url = new DynamicURL("https://example.com");
    const deeplyNested = {
      level1: {
        level2: {
          level3: {
            level4: {
              level5: {
                level6: "too deep",
              },
            },
          },
        },
      },
    };
    url.setQueryParams(deeplyNested, { maxDepth: 3 });

    // Should only go 3 levels deep, stopping before level4
    const result = url.resolve();
    expect(result).toContain("level1");
    expect(result).toContain("level2");
    expect(result).toContain("level3");
    expect(result).toContain("level4");
    expect(result).not.toContain("level5");
    expect(result).not.toContain("level6");
  });

  test("should handle skipNulls: false option", () => {
    const url = new DynamicURL("https://example.com");
    url.setQueryParams(
      { citizen: "robespierre", hero: null },
      { skipNulls: false }
    );

    expect(url.resolve()).toBe(
      "https://example.com?citizen=robespierre&hero=null"
    );
  });

  test("should use custom separator option", () => {
    const url = new DynamicURL("https://example.com");
    url.setQueryParams(
      { citizen: "robespierre", hero: "ironman" },
      { separator: ";" }
    );

    expect(url.resolve()).toBe(
      "https://example.com?citizen=robespierre;hero=ironman"
    );
  });

  test("should handle nested objects that result in empty strings when maxDepth is exceeded", () => {
    const url = new DynamicURL("https://example.com");
    url.setQueryParams(
      {
        shallow: "value",
        deep: { a: { b: { c: { d: { e: "too deep" } } } } },
      },
      { maxDepth: 2 }
    );

    const result = url.resolve();
    expect(result).toContain("shallow=value");
  });

  test("should skip null values in nested objects when skipNulls is true", () => {
    const url = new DynamicURL("https://example.com");
    url.setQueryParams({
      citizen: "robespierre",
      marvel: { hero: "ironman", villain: null, sidekick: undefined },
    });

    const result = url.resolve();
    expect(result).toContain("citizen=robespierre");
    expect(result).toContain("marvel%5Bhero%5D=ironman");
    expect(result).not.toContain("villain");
    expect(result).not.toContain("sidekick");
  });

  test("should handle nested object as the first query param", () => {
    const url = new DynamicURL("https://example.com");
    url.setQueryParams({
      marvel: { hero: "ironman", villain: "thanos" },
    });

    const result = url.resolve();
    expect(result).toBe(
      "https://example.com?marvel%5Bhero%5D=ironman&marvel%5Bvillain%5D=thanos"
    );
  });

  test("should skip nested objects with only null values", () => {
    const url = new DynamicURL("https://example.com");
    url.setQueryParams({
      citizen: "robespierre",
      emptyNested: { villain: null, sidekick: undefined },
    });

    const result = url.resolve();
    expect(result).toBe("https://example.com?citizen=robespierre");
    expect(result).not.toContain("emptyNested");
  });
});
