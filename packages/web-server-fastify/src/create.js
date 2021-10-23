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
 */
export default async (params = {}) => {
  const {
    baseCMSGraphQLURL,
  } = await validateAsync(Joi.object({
    baseCMSGraphQLURL: Joi.string().trim().uri().default(env.BASE_CMS_GRAPHQL_URL || '')
      .required(),
  }).required(), params);

  const server = fastify();
  // Add cookie parsing
  server.register(cookieParser);

  // Set BaseCMS Apollo client.
  server.register(apollo, { prop: '$apolloBaseCMS', uri: baseCMSGraphQLURL });

  server.get('/', (_, reply) => reply.send({ hello: 'world' }));
  return server;
};
