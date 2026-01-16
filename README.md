# @ambitiondev/dynamic-url

A lightweight JavaScript library for generating dynamic URLs based on templates and parameters.

[![Analyse package health](https://github.com/ambitiondev/dynamic-url/actions/workflows/analyse.yml/badge.svg?branch=main)](https://github.com/ambitiondev/dynamic-url/actions/workflows/analyse.yml)
[![codecov](https://codecov.io/gh/ambitiondev/dynamic-url/graph/badge.svg)](https://codecov.io/gh/ambitiondev/dynamic-url)
[![version](https://img.shields.io/npm/v/@ambitiondev/dynamic-url/latest.svg)][package-npm-href]
[![downloads](https://img.shields.io/npm/dm/@ambitiondev/dynamic-url.svg)][package-npm-href]

## Installation

You can install the library using npm:

```bash
npm install @ambitiondev/dynamic-url
```

## Usage

Here's a simple example of how to use the library:

```typescript
import { DynamicURL } from "@ambitiondev/dynamic-url";

// Init the url with your template
const url = new DynamicURL("https://example.com/{user}/{id}");
// Set route and query parameters
url.setRouteParams({ user: "john_doe", id: 123 });
url.setQueryParams({ ref: "newsletter", campaign: "spring_sale" });

// Resolve the final URL
console.log(url.resolve());
// Output: https://example.com/john_doe/123?ref=newsletter&campaign=spring_sale
```

## More docs

- [API](./docs/api.md)

[package-npm-href]: https://www.npmjs.com/package/@ambitiondev/dynamic-url
