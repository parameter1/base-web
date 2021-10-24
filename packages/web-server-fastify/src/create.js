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
  const {
    app,
    baseCMSGraphQL,
    site,
    tenant,
  } = await buildServerConfig(params);

  const server = fastify();
  // Add cookie parsing
  server.register(cookieParser);

  // Set BaseCMS Apollo client.
  server.register(apollo, {
    prop: '$apolloBaseCMS',
    name: app.name,
    version: app.version,
    uri: baseCMSGraphQL.url,
    link: {
      headers: {
        'x-tenant-key': tenant.key,
        'x-site-id': site.id,
        ...(baseCMSGraphQL.cacheResponses && { 'x-cache-responses': true }),
      },
    },
  });

  server.get('/', (_, reply) => reply.send({ hello: 'world' }));
  return server;
};
