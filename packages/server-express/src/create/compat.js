/* eslint-disable no-param-reassign */

const { log } = console;

/**
 * Provides compat with @parameter1/base-cms-marko-web
 * @deprecated These globals should _not_ be used if possible.
 */
module.exports = ({ server, conf }) => {
  if (!conf.get('compat.enabled')) return;
  server.locals.tenantKey = conf.get('tenant.key');
  log('@todo compat app.locals.config');
  log('@todo compat app.locals.site');
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
