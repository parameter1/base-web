import fastify from 'fastify';
import apollo from '@parameter1/marko-base-cms-apollo-ssc-fastify';
import {
  buildServerConfig,
  createBaseBrowseOptions,
  createBaseCMSOptions,
  createHelmetOptions,
} from '@parameter1/marko-base-cms-web-server-common';
import cookieParser from 'fastify-cookie';
import helmet from 'fastify-helmet';
import requestOrigin from './request-origin.js';
import versions from './versions.js';
import pkg from '../package.js';

/**
 * Boots the BaseCMS web server.
 *
 * @todo at this point, Marko does not need to be involved.
 *
 * @param {object} params
 */
export default async (params = {}) => {
  const conf = await buildServerConfig(params);
  const server = fastify({
    trustProxy: conf.getAsList('trustProxy').toArray(),
  });
  // Add cookie parsing
  server.register(cookieParser);
  // Add helmet.
  server.register(helmet, createHelmetOptions(conf));
  // Set BaseCMS Apollo client.
  server.register(apollo, createBaseCMSOptions(conf));
  // Set BaseBrowse Apollo client (is this needed globally?).
  server.register(apollo, createBaseBrowseOptions(conf));
  // Set versions.
  server.register(versions, { conf, pkg });
  // Set (relative-to-server) request origin.
  server.register(requestOrigin);
  // Set site routes.
  conf.get('routes')(server);
  return { conf, server };
};
