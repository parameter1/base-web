import express from 'express';
import Joi from '@parameter1/joi';
import { validateAsync } from '@parameter1/joi/utils.js';
import apollo from '@parameter1/marko-base-cms-apollo-ssc-express';

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

  const server = express();
  // Set BaseCMS Apollo client.
  server.use(apollo({ prop: '$apolloBaseCMS', uri: baseCMSGraphQLURL }));

  server.get('/', (_, res) => res.json({ hello: 'world' }));
  return server;
};
