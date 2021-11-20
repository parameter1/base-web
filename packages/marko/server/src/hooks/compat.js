const { wrap } = require('@parameter1/base-web-object-path');

const { emitWarning } = process;
const deprecated = (oldName, newName) => {
  emitWarning(`The ${oldName} function is only available in compat mode. Use ${newName} instead`, 'DeprecationWarning');
};
const removed = (oldName) => {
  emitWarning(`The ${oldName} function is only available in compat mode and has been removed. Remove references to this call.`, 'DeprecationWarning');
};

module.exports = ({ server, conf, marko }) => {
  if (!marko.get('compat.enabled')) return;
  const site = conf.getAsObject('site.config');

  // @todo emit waning messages anytime these functions are accessed!
  server
    .setToLocals('tenantKey', conf.get('tenant.key'))
    .setToLocals('onAsyncBlockError', marko.get('hooks.onAsyncBlockError'))
    .setToLocals('document', marko.get('document'))
    .setToLocals('config', {
      setWebsiteContext: () => {},
      website: (path, def) => {
        deprecated('config.website', 'conf.get(`site.{path}`)');
        return conf.get(`site.${path}`, def);
      },
      locale: () => {
        deprecated('config.locale', "conf.get('site.language.code')");
        return conf.get('site.language.code');
      },
      lazyloadImages: () => {
        removed('config.lazyloadImages');
        return true;
      },
      fallbackImage: () => {
        removed('config.fallbackImage');
        return null;
      },
      siteName: () => {
        deprecated('config.siteName', "conf.get('site.name')");
        return conf.get('site.name');
      },
      get: (path, def) => {
        deprecated('config.get', 'conf.get');
        return conf.get(path, def);
      },
      getAsArray: (path, def) => {
        deprecated('config.getAsArray', 'conf.getAsArray');
        return conf.getAsArray(path, def);
      },
      getAsObject: (path, def) => {
        deprecated('config.getAsObject', 'conf.getAsObject');
        return conf.getAsObject(path, def);
      },
      styles: () => {
        deprecated('config.styles', "marko.get('dist.css')");
        return ([marko.get('dist.css')()]);
      },
      sources: () => {
        deprecated('config.sources', "marko.get('dist.js')");
        return ([marko.get('dist.js')()]);
      },
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
