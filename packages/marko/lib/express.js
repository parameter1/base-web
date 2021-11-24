/* eslint-disable no-underscore-dangle */
require('marko');

// eslint-disable-next-line import/no-extraneous-dependencies
const express = module.main ? module.main.require('express') : require('express');

if (!express) throw new Error('Unable to load Express.');

const allowedGlobals = new Set([
  'conf',
  'marko',
  'baseBrowseGraphQLClient',
  'baseCMSGraphQLClient',
  'request',
  'contentPreviewModeEnabled',

  // internals
  'runtimeId',
  'template',
  '$wa',
  '___components',
  'componentIdPrefix',
  'widgetIdPrefix',
  'noBrowserRerender',
  'oldHydrateNoCreate',
  '__awaitReordererInvoked',
  '___clientReorderContext',
  '___isLastFlush',
  '___didSerializeComponents',
  '___typesLookup',
  'serializedGlobals',
  'cspNonce',
]);

const patch = (response) => {
  response.marko = response.marko || function markoResponse(template, data) {
    if (typeof template === 'string') throw new Error('res.marko does not accept a string or path as a template.');

    const res = this;
    const { req, app } = res;

    const $global = {
      app,
      req,
      res,
      ...app.locals,
      ...res.locals,
    };
    res.set('content-type', 'text/html; charset=utf-8');

    const hasWarned = new Set();
    const proxied = (process.env.COMPAT_ENABLED) ? new Proxy({
      ...$global, ...(data && data.$global),
    }, {
      get: (target, prop) => {
        if (!allowedGlobals.has(prop) && typeof prop !== 'symbol' && !hasWarned.has(prop)) {
          hasWarned.add(prop);
          process.emitWarning(`Accessing out.global.${prop} within templates is deprecated. Remove or use alternative.`, { code: `out.global.${prop}`, type: 'DeprecationWarning' });
        }
        return target[prop];
      },
    }) : { ...$global, ...(data && data.$global) };

    return template.render({ ...(data || {}), $global: proxied }, res).on('error', req.next);
  };
};

patch(express.response);
delete require.cache[__filename];

module.exports = () => {
  const app = express();
  app.once('mount', (parent) => {
    patch(parent.response);
    if (parent._router) {
      parent._router.stack.pop(); // express <= 4.x
    } else {
      parent.router.stack.pop(); // express 5.x
    }
  });
  return app;
};
