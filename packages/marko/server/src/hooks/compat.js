const { wrap } = require('@parameter1/base-web-object-path');
const { deprecated, removed } = require('../deprecate');

module.exports = ({ server, conf, marko }) => {
  if (!marko.get('compat.enabled')) return;
  const site = conf.getAsObject('site.config');

  // @todo emit waning messages anytime these functions are accessed!
  server
    .setToLocals('tenantKey', conf.get('tenant.key'))
    .setToLocals('onAsyncBlockError', marko.get('hooks.onAsyncBlockError'))
    .setToLocals('document', marko.get('document'))
    .setToLocals('config', {
      setWebsiteContext: removed(() => {}, 'config.setWebsiteContext'),
      website: deprecated((path, def) => conf.get(`site.${path}`, def), 'config.website', 'conf.get(`site.{path}`)'),
      locale: deprecated(() => conf.get('site.language.code'), 'config.locale', "conf.get('site.language.code')"),
      lazyloadImages: removed(() => true, 'config.lazyloadImages'),
      fallbackImage: removed(() => null, 'config.fallbackImage'),
      siteName: deprecated(() => conf.get('site.name'), 'config.siteName', "conf.get('site.name')"),
      get: deprecated((path, def) => conf.get(path, def), 'config.get', 'conf.get'),
      getAsArray: deprecated((path, def) => conf.getAsArray(path, def), 'config.getAsArray', 'conf.getAsArray'),
      getAsObject: deprecated((path, def) => conf.getAsObject(path, def), 'config.getAsObject', 'conf.getAsObject'),
      styles: deprecated(() => ([marko.get('dist.css')()]), 'config.styles', "marko.get('dist.css')"),
      sources: deprecated(() => ([marko.get('dist.js')()]), 'config.sources', "marko.get('dist.js')"),
    })
    .setToLocals('site', {
      config: site,
      ...wrap(site),
    });

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
