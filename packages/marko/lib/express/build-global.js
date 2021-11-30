const allowedGlobals = new Set([
  'conf',
  'marko',
  'baseBrowseGraphQLClient',
  'baseCMSGraphQLClient',
  'request',
  'contentPreviewModeEnabled',
  'parseEmbeddedMedia',

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

/**
 * Generates the marko `$global` template property.
 *
 * @param {object} res The Express response object.
 */
module.exports = (res, data) => {
  const { req, app } = res;
  const $global = {
    app,
    req,
    res,
    ...app.locals,
    ...res.locals,
  };

  const hasWarned = new Set();
  return (process.env.COMPAT_ENABLED) ? new Proxy({
    ...$global, ...(data && data.$global),
  }, {
    get: (target, prop) => {
      if (!allowedGlobals.has(prop) && typeof prop !== 'symbol' && !hasWarned.has(prop)) {
        hasWarned.add(prop);
        process.emitWarning(`Accessing out.global.${prop} within templates is deprecated. Remove or use alternative.`, { code: `compat:out.global.${prop}`, type: 'DeprecationWarning' });
      }
      return target[prop];
    },
  }) : { ...$global, ...(data && data.$global) };
};
