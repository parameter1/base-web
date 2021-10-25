import express from 'express';
import { buildServerConfig } from '@parameter1/base-web-server-common';

export default async (params = {}) => {
  const conf = await buildServerConfig(params);
  const server = express();

  server.set('trust proxy', conf.getAsList('trustProxy').toArray());
  server.locals.conf = conf;
  return { server, conf };
};
