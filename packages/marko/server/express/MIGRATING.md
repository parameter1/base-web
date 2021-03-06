# Migrating from BaseCMS Marko Web

## Booting
```js
const bootServer = require('@parameter1/base-web-server-express/boot');
const pkg = require('../package.json');

bootServer({
  // boot config
  host: 'localhost', // default
  port: 45893, // default
  onError: () => {
    // do something when the internal sever (terminus) wrapper errors
  },
  // server/site config
  server: {
    // working/root directory of the site
    cwd: __dirname,
    app: { name: pkg.name, version: pkg.version },
    // site routes
    routes: (server) => {
      server.get('/', (_, res) => res.json({ hello: 'world' }));
    },
    site: {
      name: 'Overdrive',
      host: 'www.overdriveonline.com',
      imageHost: 'img.overdriveonline.com',
      assetHost: 'cdn.overdriveonline.com',
      config: {
        // generic site config, anything you'd like here
      },
    },
  },
});
```

## Boot Config
See `./src/boot/config/schema.js` for complete list of fields. Note that `onError` is used for handling internal service errors, not for handling errors inside the server code itself.

## Server/Site Config
Passed from `boot` via `config.server`. The config object is wrapped with `object-path` helpers (such as `get`, `set`, `getAsArray` etc), which must be used when accessing values. The config is set globally to the `server.conf` property (when accessing via an Express route) or `out.global.conf` when in a Marko template.

The `site` config is now embedded within the server config, accesible via `server.conf.get('site.config')` or `out.global.conf.get('site.config')`. This (along with GraphQL) is probably the largest change. The core site values (such as name, host, imageHost, etc) must now be set at boot time. This prevents the web server from having to make a website context query on _every_ request.

## Config Changes
- `onAsyncBlockError` becomes `marko.error.asyncBlockNotifier`
- `onFatalError` becomes `error.notifier`

## Globals (req, res.locals, app.locals)
Enabling compatibility mode (via `config.server.compat.enabled` or the `COMPAT_ENABLED` env variable) will also apply the legacy values. This should be avoided if possible.

- [ ] **NOTE** Eventually the `app`, `req` and `res` objects that Marko sets to the `out.global` object will be deprecated/removed.

- `app.locals.onAsyncBlockError` changed to `server.conf.get('hooks.onAsyncBlockError')`
- `app.locals.config` changed to `server.conf`
- `app.locals.site` changed to `server.conf.get('site.config')`
- `app.locals.tenantKey` changed to `server.conf.get('tenant.key')`
- `res.locals.requestOrigin` changed to `res.locals.request.origin`
- `req.$baseBrowse` and `res.locals.$baseBrowse` changed to `res.locals.baseBrowseGraphQLClient`
- `req.apollo` and `res.locals.apollo` changed to `res.locals.baseCMSGraphQLClient`

## Browser
- [x] the deprecated `CMSBrowserComponents.loadComponent` function is no longer available, use `load` instead

## Custom Root Document
CSS and JS asset loading has changed. Use the `marko.get("dist.css")()` and `marko.get("dist.js")()` function calls instead. Compat mode will still support the `config.styles()` and `config.sources()` calls.

## Marko Components
Generally speaking, to get the same component access as `@parameter1/base-cms-marko-web` and `@parameter1/base-cms-marko-core` the following component packages must be installed
  - `@parameter1/base-web-marko-components-core`
  - `@parameter1/base-web-marko-components-query`
  - `@parameter1/base-web-marko-components-element`
  - `@parameter1/base-web-marko-components-node`

### Page / Document
- To use, the `@parameter1/base-web-marko-components-core` package must be installed
### Query
- To use, the `@parameter1/base-web-marko-components-query` package must be installed
- `<marko-web-query-*>` components names have stayed the same

### Core/Web Block/Elements
- Some duplicate components existed in both `base-cms-marko-core` and `base-cms-marko-web`
- To use, the `@parameter1/base-web-marko-components-element` package must be installed
- Both the `<marko-web->` and `<marko-core->` components still exist
- Some were merged (but both component names still exist)
  - array
  - date
  - link
  - text
- Otherwise the others were kept under sub-folders `web` and `core` respectively

## Node / Node List
- To use, the `@parameter1/base-web-marko-components-node` package must be installed
