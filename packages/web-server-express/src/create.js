import express from 'express';
import apollo from '@parameter1/marko-base-cms-apollo-ssc-express';
import {
  buildServerConfig,
  createBaseBrowseOptions,
  createBaseCMSOptions,
  createVersionHeader,
} from '@parameter1/marko-base-cms-web-server-common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
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
  const server = express();
  // Add cookie parsing.
  server.use(cookieParser());

  // Add helmet.
  server.use(helmet({
    frameguard: false,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    ...conf.get('helmet').toObject(),
  }));

  // Set BaseCMS Apollo client.
  server.use(apollo(createBaseCMSOptions(conf)));

  // Set BaseBrowse Apollo client.
  server.use(apollo(createBaseBrowseOptions(conf)));

  // Set versions.
  server.use((_, res, next) => {
    res.set(...createVersionHeader(conf, pkg));
    next();
  });

  // Set site routes.
  conf.get('routes')(server);

  return { conf, server };
};
