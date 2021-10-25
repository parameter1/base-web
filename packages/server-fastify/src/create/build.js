import fastify from 'fastify';
import { buildServerConfig } from '@parameter1/base-web-server-common';

export default async (params) => {
  const conf = await buildServerConfig(params);
  const server = fastify({
    trustProxy: conf.getAsList('trustProxy').toArray(),
  });
  server.decorate('locals', { conf: null });
  server.locals.conf = conf;
  return { server, conf };
};
