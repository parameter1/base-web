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
Passed from `boot` via `config.server`. The config object is wrapped with `object-path` helpers (such as `get`, `set`, `getAsArray` etc), which must be used when accessing values. The config is set globally to the `server.$conf` property (when accessing via an Express route) or `out.global.$conf` when in a Marko template.

The `site` config is now embedded within the server config, accesible via `server.$conf.get('site.config')` or `out.global.$conf.get('site.config')`. This (along with GraphQL) is probably the largest change. The core site values (such as name, host, imageHost, etc) must now be set at boot time. This prevents the web server from having to make a website context query on _every_ request.

## Globals (req, res.locals, app.locals)
Enabling compatibility mode (via `config.server.compat.enabled` or the `COMPAT_ENABLED` env variable) will also apply the legacy values. This should be avoided if possible.

- `app.locals.onAsyncBlockError` changed to `server.$conf.get('hooks.onAsyncBlockError')`
- `app.locals.config` changed to `server.$conf`
- `app.locals.site` changed to `server.$conf.get('site.config')`
- `app.locals.tenantKey` changed to `server.$conf.get('tenant.key')`
- `res.locals.requestOrigin` changed to `req.$requestOrigin`
- `req.$baseBrowse` and `res.locals.$baseBrowse` changed to `req.$baseBrowseGraphQLClient`
- `req.apollo` and 1res.locals.apollo` changed to

## Browser
- [ ] the deprecated `CMSBrowserComponents.loadComponent` function is no longer available, use `load` instead
