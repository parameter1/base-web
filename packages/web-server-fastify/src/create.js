import fastify from 'fastify';
import Joi from '@parameter1/joi';
import { validateAsync } from '@parameter1/joi/utils.js';
import apollo from '@parameter1/marko-base-cms-apollo-ssc-fastify';
import cookieParser from 'fastify-cookie';

const { env } = process;

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
    baseCMSGraphQLURL,
    siteId,
    tenantKey,
  } = await validateAsync(Joi.object({
    baseCMSGraphQLURL: Joi.string().trim().uri().required(),
    siteId: Joi.string().trim().pattern(/^[a-f0-9]{24}$/).required(),
    tenantKey: Joi.string().trim().pattern(/^[a-z0-9]+_[a-z0-9]+$/).required(),
  }).required(), {
    ...params,
    baseCMSGraphQLURL: params.baseCMSGraphQLURL || env.BASE_CMS_GRAPHQL_URL,
    siteId: params.siteId || env.SITE_ID,
    tenantKey: params.tenantKey || env.TENANT_KEY,
  });

  const server = fastify();
  // Add cookie parsing
  server.register(cookieParser);

  // Set BaseCMS Apollo client.
  server.register(apollo, {
    prop: '$apolloBaseCMS',
    uri: baseCMSGraphQLURL,
    link: { headers: { 'x-tenant-key': tenantKey, 'x-site-id': siteId } },
  });

  server.get('/', (_, reply) => reply.send({ hello: 'world' }));
  return server;
};
