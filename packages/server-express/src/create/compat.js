/* eslint-disable no-param-reassign */
/**
 * Provides compat with @parameter1/base-cms-marko-web
 * @deprecated These globals should _not_ be used if possible.
 */
module.exports = ({ server, conf }) => {
  if (!conf.get('compat.enabled')) return;
  server.locals.tenantKey = conf.get('tenant.key');
  server.use((req, res, next) => {
    res.locals.requestOrigin = req.$requestOrigin;
    next();
  });
};
