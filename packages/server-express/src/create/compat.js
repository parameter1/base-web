/* eslint-disable no-param-reassign */
const { wrap } = require('@parameter1/base-web-object-path');

/**
 * Provides compat with @parameter1/base-cms-marko-web
 * @deprecated These globals should _not_ be used if possible.
 */
module.exports = ({ server, conf }) => {
  if (!conf.get('compat.enabled')) return;
  server.locals.tenantKey = conf.get('tenant.key');

  server.locals.onAsyncBlockError = conf.get('hooks.onAsyncBlockError');

  // "core" config
  server.locals.config = {
    setWebsiteContext: () => {},
    website: (path, def) => conf.get(`site.${path}`, def),
    locale: () => conf.get('site.language.code'),
    lazyloadImages: () => true,
    fallbackImage: () => null,
    siteName: () => conf.get('site.name'),
    sources: () => ([]),
    styles: () => ([]),
    get: (path, def) => conf.get(path, def),
    getAsArray: (path, def) => conf.getAsArray(path, def),
    getAsObject: (path, def) => conf.getAsObject(path, def),
  };

  // site config
  const site = conf.getAsObject('site.config');
  server.locals.site = {
    config: site,
    ...wrap(site),
  };

  server.use((req, res, next) => {
    const {
      $baseBrowseGraphQLClient,
      $baseCMSGraphQLClient,
      $requestOrigin,
    } = req;
    req.$baseBrowse = $baseBrowseGraphQLClient;
    res.locals.$baseBrowse = $baseBrowseGraphQLClient;

    req.apollo = $baseCMSGraphQLClient;
    res.locals.apollo = $baseCMSGraphQLClient;

    res.locals.requestOrigin = $requestOrigin;

    next();
  });
};
