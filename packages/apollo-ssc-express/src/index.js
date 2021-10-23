import createApolloClient from '@parameter1/marko-base-cms-apollo-ssc';
import { isFunction as isFn } from '@parameter1/marko-base-cms-utils';

/**
 * Provides the Express Apollo middleware.
 *
 * @param {object} params
 * @param {string} [params.prop=$apollo] The Express req/res property to set the client to.
 * @param {function} [params.contextFn] An optional context function to run on every request.
 *                                      The Express `req` and `res` objects are appended.
 * @param {object} params.config The remaining configuration to the pass to the client factory
 * @param {string} params.config.uri
 * @param {object} [params.config.cache]
 * @param {object} [params.config.link]
 * @param {...object} [params.config.rest]
 * @returns {function}
 */
export default ({ prop = '$apollo', contextFn, ...config } = {}) => (req, res, next) => {
  const client = createApolloClient({
    ...config,
    contextFn: (ctx) => {
      if (isFn(contextFn)) return contextFn({ req, res, ctx });
      return undefined;
    },
  });

  req[prop] = client;
  res.locals[prop] = client;
  next();
};
