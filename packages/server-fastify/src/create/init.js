import fastify from 'fastify';
import { buildServerConfig } from '@parameter1/base-web-server-common';
import urlData from 'fastify-url-data';

export default async (params) => {
  const conf = await buildServerConfig(params);
  const server = fastify({
    trustProxy: conf.getAsList('trustProxy').toArray(),
  });
  server.register(urlData);
  server.decorate('$conf', null);
  server.$conf = conf;
  return { server, conf };
};
