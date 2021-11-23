const { createError } = require('@parameter1/base-web-server-common/errors');
const { redirectOrError } = require('@parameter1/base-web-server-common/config');
const { isFunction: isFn } = require('@parameter1/base-web-utils');

module.exports = ({ server }) => {
  // Force express to throw 404s instead of handling natively.
  // This will move the error into the "standard" error handler.
  server.use((req, res, next) => { // eslint-disable-line no-unused-vars
    throw createError(404, `No page found for ${req.path}`);
  });

  server.use((err, req, res, next) => {
    const { $conf } = req.app;
    const renderError = ({ error } = {}) => {
      const notify = $conf.get('error.notifier');
      if (isFn(notify)) notify({ error });
      const render = $conf.get('error.renderer');
      if (isFn(render)) {
        render({ error, req, res });
      } else {
        next(error);
      }
    };

    redirectOrError({
      error: err,
      conf: $conf,
      baseCMSClient: req.$baseCMSGraphQLClient,
      path: req.path,
      cookies: req.cookies,
      queryParams: req.query,
      contentPreviewModeEnabled: req.$contentPreviewModeEnabled,
      customRedirectHandler: $conf.get('redirectHandler'),
    }).then(({ redirect, error }) => {
      if (redirect && redirect.to) {
        redirect.headers.forEach(({ key, value }) => {
          res.setHeader(key, value);
        });
        res.redirect(redirect.code, redirect.to);
      } else {
        renderError({ error });
      }
    }).catch((e) => {
      renderError({ error: e });
    });
  });
};
