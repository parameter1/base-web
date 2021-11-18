# Migration From `base-cms` to `base-web`

## Packages
### Changed
- `@parameter1/base-cms-object-path`
  - Renamed to `@parameter1/base-web-object-path`
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
  - [ ] Moved factories and loaders to `@parameter1/loaders` (@todo determine where to move these)
  - Utils
    - [x] `extractFragmentData` and `extractFragmentName` moved to `@parameter1/graphql/fragment` as `extractData` and `extractName`
    - [x] The remaining functions were removed (they don't appear to be in use): `elementClassNames`, `linkClassNames`, `modelClassNames`, `objectTypeName`, `sectionPath`

## Removed
The following packages were removed completely. Alternatives must be found.
- `@parameter1/base-cms-env`
- `@parameter1/base-cms-micro`
- `@parameter1/base-cms-tooling`
