const markoMiddleware = require('@parameter1/base-web-marko-lib/express');
const { wrap } = require('@parameter1/base-web-object-path');
const document = require('@parameter1/base-web-marko-core/components/document/index.marko');

const compat = ({ server, conf, marko }) => {
  if (!conf.get('compat.enabled')) return;
  const site = conf.getAsObject('site.config');

  server
    .setToLocals('tenantKey', conf.get('tenant.key'))
    .setToLocals('onAsyncBlockError', marko.get('hooks.onAsyncBlockError'))
    .setToLocals('document', marko.get('document'))
    .setToLocals('config', {
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

module.exports = ({ server, conf, marko }) => {
  // this is only being added to move `$conf` to the root marko out.global
  server.setToLocals('$conf', conf);
  // set the root document component
  if (!marko.get('document')) marko.set('document', document);
  // set the marko config
  server.setToLocals('$marko', marko);
  // enabled compat mode (if set)
  compat({ server, conf, marko });
  // install the marko middleware
  server.use(markoMiddleware());
};
