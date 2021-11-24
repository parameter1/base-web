# Migration From `base-cms` to `base-web`

## Packages
### Changed
- `@parameter1/base-cms-apollo-ssr`
  - [x] Renamed to `@parameter1/base-web-apollo-ssc`
  - Default export is the same
  - The `uri` option is the same
  - Factory options are slightly different
    - `headers` is now `link.headers`
    - `cacheConfig` is now `cache`
    - `linkConfig` is now `link`
    - `config` is now `...rest`
- `@parameter1/base-cms-express-apollo`
  - [x] Renamed to `@parameter1/base-web-apollo-ssc-express`
  - API shape is completely new: now only exports the Express middleware
- `@parameter1/base-cms-graphql-fragment-types`
  - [x] Renamed to `@parameter1/base-web-graphql-fragment-types`
  - [x] BaseCMS types can now be included require via `@parameter1/base-web-graphql-fragment-types/base-cms` instead of `@parameter1/base-cms-graphql-fragment-types`
- `@parameter1/base-cms-html`
  - [x] Renamed to `@parameter1/base-web-html`
  - Default exports are the same
- `@parameter1/base-cms-image`
  - [x] Renamed to `@parameter1/base-web-image`
  - Default exports are the same
- `@parameter1/base-cms-inflector`
  - [x] Renamed to `@parameter1/base-web-inflector`
  - [x] Exports are the same
- `@parameter1/base-cms-object-path`
  - [x] Renamed to `@parameter1/base-web-object-path`
  - [x] All exports rename the same
- `@parameter1/base-cms-utils`
  - Renamed to `@parameter1/base-web-utils`
  - Maintained
    - [x] `asArray`
    - [x] `asObject`
    - [x] `cleanPath`
    - [x] `isFunction`
    - [x] `isObject`
  - Renamed
    - [x] `sleep` is now `wait`
  - Removed
    - [x] `isDev`
  - Added
    - [x] `getProfileMS`
    - [x] `immediatelyThrow`
    - [x] `round`
  - Moved
    - [ ] `contentTypes`
    - [ ] `getDefaultContentTypes`
    - [ ] `getDefaultTaxonomyTypes`
    - [ ] `getPublishedContentCriteria`
  - Still need a home
    - [ ] `asyncRoute` (should likely move to express server as a single export)
    - [ ] `bem`
    - [ ] `callOnce`
    - [ ] `compareNumbers`
    - [ ] `parseBooleanHeader`
    - [ ] `parseDelimitedString`
    - [ ] `profiler`
    - [ ] `randomElementId`
    - [ ] `warn`

- `@parameter1/base-cms-web-common`
  - [x] Moved queries to `@parameter1/marko-web-queries`
    - [x] They are now accesable via the `executeQuery` export (e.g. `const { excuteQuery } = require('@parameter1/queries/website-scheduled-content')`)
  - Utils
    - [x] `extractFragmentData` and `extractFragmentName` moved to `@parameter1/graphql/fragment` as `extractData` and `extractName`
    - [x] The remaining functions were removed (they don't appear to be in use): `elementClassNames`, `linkClassNames`, `modelClassNames`, `objectTypeName`, `sectionPath`

## Needs Review
- [ ] `@parameter1/base-cms-dependency-tool`

## Not Migrated
The following packages weren't migrated. If they still need to be used they should use the old package names or integrate the functionality directly.
- `@parameter1/base-cms-async`
  - should now use the `async` lib directly
  - only internally used by the `db` package and the `graphql-server` and `hooks` services
- `@parameter1/base-cms-base4-rest-api`
  - only internally used by the `graphql-server`
- `@parameter1/base-cms-canonical-path`
  - only internally used by the `graphql-server`
- `@parameter1/base-cms-cli-utils`
  - enveloped by the new web cli
- `@parameter1/base-cms-db`
  - only internaly used by `canonical-path` and services
- `@parameter1/base-cms-env`
- `@parameter1/base-cms-micro`
- `@parameter1/base-cms-tooling`
