import express from 'express';
import apollo from '@parameter1/marko-base-cms-apollo-ssc-express';
import { buildServerConfig } from '@parameter1/marko-base-cms-web-server-common';
import cookieParser from 'cookie-parser';

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

  const server = express();
  // Add cookie parsing.
  server.use(cookieParser());

  // Set BaseCMS Apollo client.
  server.use(apollo({
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
  }));

  server.get('/', (_, res) => res.json({ hello: 'world' }));
  return server;
};
