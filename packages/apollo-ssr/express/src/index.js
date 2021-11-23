const createApolloClient = require('@parameter1/base-web-apollo-ssr-client');
const { isFunction: isFn } = require('@parameter1/base-web-utils');

/**
 * Provides the Express Apollo middleware.
 *
 * @param {object} params
 * @param {string} [params.prop=$apollo] The Express res property to set the client to.
 * @param {function} [params.contextFn] An optional context function to run on every request.
 *                                      The Express `req` and `res` objects are appended.
 * @param {object} params.config The remaining configuration to the pass to the client factory
 * @param {string} params.config.uri
 * @param {object} [params.config.cache]
 * @param {object} [params.config.link]
 * @param {...object} [params.config.rest]
 * @returns {function}
 */
module.exports = ({ prop = '$apollo', contextFn, ...config } = {}) => (req, res, next) => {
  if (res.locals[prop]) throw new Error(`An Apollo GraphQL client (or other value) has already been registered to prop ${prop}`);
  const client = createApolloClient({
    ...config,
    contextFn: (ctx) => {
      if (isFn(contextFn)) return contextFn({ req, res, ctx });
      return undefined;
    },
  });
  res.locals[prop] = client;
  next();
};
