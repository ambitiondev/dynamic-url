# @ambitiondev/dynamic-url

A lightweight JavaScript library for generating dynamic URLs based on templates and parameters.

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
