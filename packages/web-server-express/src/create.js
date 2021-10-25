import express from 'express';
import apollo from '@parameter1/marko-base-cms-apollo-ssc-express';
import { buildServerConfig } from '@parameter1/marko-base-cms-web-server-common';
import cookieParser from 'cookie-parser';
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
  const server = express();
  // Add cookie parsing.
  server.use(cookieParser());

  // Set BaseCMS Apollo client.
  server.use(apollo({
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
  }));

  // Set versions.
  server.use((_, res, next) => {
    res.set('x-versions', `site=${conf.get('app.version')}; core=${pkg.version}`);
    next();
  });

  server.get('/', (_, res) => res.json({ hello: 'world' }));
  return server;
};
