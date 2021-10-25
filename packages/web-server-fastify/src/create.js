import fastify from 'fastify';
import apollo from '@parameter1/marko-base-cms-apollo-ssc-fastify';
import {
  buildServerConfig,
  createBaseBrowseOptions,
  createBaseCMSOptions,
  createVersionHeader,
} from '@parameter1/marko-base-cms-web-server-common';
import cookieParser from 'fastify-cookie';
import helmet from 'fastify-helmet';
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
  server.register(apollo, createBaseCMSOptions(conf));

  // Set BaseBrowse Apollo client.
  server.register(apollo, createBaseBrowseOptions(conf));

  // Set versions.
  server.addHook('preHandler', (_, reply, done) => {
    reply.header(...createVersionHeader(conf, pkg));
    done();
  });

  // Set site routes.
  conf.get('routes')(server);

  return { conf, server };
};
