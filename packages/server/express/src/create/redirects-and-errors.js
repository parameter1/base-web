const { createError } = require('@parameter1/base-web-server-common/errors');
const { redirectOrError } = require('@parameter1/base-web-server-common/config');

module.exports = ({ server }) => {
  // Force express to throw 404s instead of handling natively.
  // This will move the error into the "standard" error handler.
  server.use((req, res, next) => { // eslint-disable-line no-unused-vars
    throw createError(404, `No page found for ${req.path}`);
  });

  server.use((err, req, res, next) => {
    // need to get custom redirect handler from config
    // need to get error render from config
    // need to get fatal error??

    redirectOrError({
      error: err,
      conf: req.app.$conf,
      baseCMSClient: req.$baseCMSGraphQLClient,
      path: req.path,
      cookies: req.cookies,
      queryParams: req.query,
      contentPreviewModeEnabled: req.$contentPreviewModeEnabled,
    }).then(({ redirect, error }) => {
      console.log({ redirect });
      if (redirect && redirect.to) {
        redirect.headers.forEach(({ key, value }) => {
          res.setHeader(key, value);
        });
        res.redirect(redirect.code, redirect.to);
      } else {
        next(error);
      }
    }).catch((e) => {
      // fatal handler??? or do regular render??
      console.error(e);
      next(e);
    });
  });
};
