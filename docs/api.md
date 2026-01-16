# Class: DynamicURL

## Constructors

### Constructor

> **new DynamicURL**(`url`): `DynamicURL`

#### Parameters

##### url

`string`

#### Returns

`DynamicURL`

## Methods

### resolve()

> **resolve**(): `string`

Resolves and returns the final URL as a string.

#### Returns

`string`

#### Example

```ts
const url = new DynamicURL("https://example.com/{citizen}/{hero}");
url.setRouteParams({ citizen: "robespierre", hero: "ironman" });

// Resolve the final URL
console.log(url.resolve()); // "https://example.com/robespierre/ironman"
```

***

### setQueryParams()

> **setQueryParams**(`query`, `options?`): `DynamicURL`

Takes a query object and appends it to the URL as a query string.

#### Parameters

##### query

`Record`\<`string`, `any`\>

An object representing the query parameters.

##### options?

`IStringifyQueryOptions`

#### Returns

`DynamicURL`

#### Example

```ts
const url = new DynamicURL("https://example.com");
url.setQueryParams({ citizen: "robespierre", hero: "ironman" });
console.log(url.resolve()); // "https://example.com?citizen=robespierre&hero=ironman"
```

***

### setRouteParams()

> **setRouteParams**(`replaceValue`): `DynamicURL`

Replaces route parameters in the URL with the provided values.

#### Parameters

##### replaceValue

An object or string to replace the route parameters.

`string` | `TParamsObject`

#### Returns

`DynamicURL`

#### See

TParamsObject

#### Example

```ts
const url = new DynamicURL("https://example.com/{citizen}/{hero}");
url.setRouteParams({ citizen: "robespierre", hero: "ironman" });
console.log(url.resolve()); // "https://example.com/robespierre/ironman"
```
