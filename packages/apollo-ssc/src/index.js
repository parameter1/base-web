const { ApolloClient, InMemoryCache, createHttpLink } = require('@apollo/client/core');
const { setContext } = require('@apollo/client/link/context');
const { isFunction: isFn } = require('@parameter1/base-web-utils');
const fetch = require('node-fetch');

/**
 * Creates an Apollo GraphQL client optimized for use on the server.
 *
 * This client *must* be created on each request, otherwise in-memory caching
 * will remain persistent between requests, producing undesirable/unknown results.
 *
 * @param {object} params
 * @param {string} params.uri The GraphQL URI to connect to.
 * @param {object} [params.cache] Cache configuration options. These are passed directly
 *                                to the `InMemoryCache` constructor.
 * @param {object} [params.link] Link configuration options. These are passed directly
 *                                to the `HttpLink` constructor.
 * @param {function} [params.contextFn] An optional context function to execute on each request.
 * @param {...object} [params.rest] Additonal config options passed to the `ApolloClient`
 *                                  constructor.
 */
module.exports = ({
  uri,
  cache,
  link,
  contextFn,
  ...rest
} = {}) => {
  if (!uri) throw new Error('A GraphQL URI must be provided.');
  const context = setContext((ctx) => {
    if (isFn(contextFn)) return contextFn(ctx);
    return undefined;
  });
  const http = createHttpLink({
    fetch,
    ...link,
    uri,
  });
  return new ApolloClient({
    ...rest,
    link: context.concat(http),
    cache: new InMemoryCache(cache),
    ssrMode: true,
    connectToDevTools: false,
  });
};
