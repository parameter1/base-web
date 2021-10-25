import createApolloClient from '@parameter1/base-web-apollo-ssc';
import { isFunction as isFn } from '@parameter1/base-web-utils';
import fp from 'fastify-plugin';

/**
 * Provides the Fastify Apollo plugin.
 *
 * @param {object} fastify
 * @param {object} params
 * @param {string} [params.prop=$apollo] The Fastify `req` property to set the client to.
 * @param {function} [params.contextFn] An optional context function to run on every request.
 *                                      The Fastify `req` and `reply` objects are appended.
 * @param {object} params.config The remaining configuration to the pass to the client factory
 * @param {string} params.config.uri
 * @param {object} [params.config.cache]
 * @param {object} [params.config.link]
 * @param {...object} [params.config.rest]
 * @param {function} next
 */
const plugin = (fastify, { prop = '$apollo', contextFn, ...config }, next) => {
  fastify.decorateRequest(prop, null);
  fastify.addHook('onRequest', (req, reply, done) => {
    const client = createApolloClient({
      ...config,
      contextFn: (ctx) => {
        if (isFn(contextFn)) return contextFn({ req, reply, ctx });
        return undefined;
      },
    });
    req[prop] = client;
    done();
  });
  next();
};

export default fp(plugin, {
  name: 'apollo-ssc',
  fastify: '>=3',
});
