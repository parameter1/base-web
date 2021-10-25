import fastify from 'fastify';
import apollo from '@parameter1/marko-base-cms-apollo-ssc-fastify';
import { buildServerConfig } from '@parameter1/marko-base-cms-web-server-common';
import cookieParser from 'fastify-cookie';
import helmet from 'fastify-helmet';
import pkg from '../package.js';

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

  // Add helmet.
  server.register(helmet, {
    frameguard: false,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    ...conf.get('helmet').toObject(),
  });

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

  // Set versions.
  server.addHook('preHandler', (_, reply, done) => {
    reply.header('x-versions', `site=${conf.get('app.version')}; core=${pkg.version}`);
    done();
  });

  server.get('/', (_, reply) => reply.send({ hello: 'world' }));
  return server;
};
