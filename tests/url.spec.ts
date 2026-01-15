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
});
