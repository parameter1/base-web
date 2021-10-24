import fastify from 'fastify';
import apollo from '@parameter1/marko-base-cms-apollo-ssc-fastify';
import { buildServerConfig } from '@parameter1/marko-base-cms-web-server-common';
import cookieParser from 'fastify-cookie';

/**
 * Boots the BaseCMS web server.
 *
 * @todo at this point, Marko does not need to be involved.
 *
 * @param {object} params
 * @param {string} params.baseCMSGraphQLURL
 * @param {string} params.siteId
 * @param {string} params.tenantKey
 */
export default async (params = {}) => {
  const conf = await buildServerConfig(params);
  const server = fastify();
  // Add cookie parsing
  server.register(cookieParser);

  // Set BaseCMS Apollo client.
  server.register(apollo, {
    prop: conf.get('baseCMSGraphQL.prop'),
    name: conf.get('app.name'),
    version: conf.get('app.version'),
    uri: conf.get('baseCMSGraphQL.url'),
    link: {
      headers: {
        'x-tenant-key': conf.get('tenant.key'),
        'x-site-id': conf.get('site.id'),
        ...(conf.get('baseCMSGraphQL.cacheResponses') && { 'x-cache-responses': true }),
      },
    },
  });

  server.get('/', (_, reply) => reply.send({ hello: 'world' }));
  return server;
};
