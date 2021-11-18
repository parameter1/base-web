# Migration From `base-cms` to `base-web`

## Packages
### Changed
- `@parameter1/base-cms-object-path`
  - Renamed to `@parameter1/base-web-object-path`
  - [x] All exports rename the same
- `@parameter1/base-cms-utils`
  - Moved
    - [ ] `getDefaultContentTypes`
    - [ ] `getDefaultTaxonomyTypes`
    - [ ] `getPublishedContentCriteria`
  - Removed
    - [x] `isDev`
  - Renamed
    - [x] `sleep` is now `wait`

## Removed
The following packages were removed completely. Alternatives must be found.
- `@parameter1/base-cms-env`
- `@parameter1/base-cms-micro`
- `@parameter1/base-cms-tooling`
