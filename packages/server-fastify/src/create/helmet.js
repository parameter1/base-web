import helmet from 'fastify-helmet';
import { createHelmetOptions } from '@parameter1/base-web-server-common';

export default ({ server, conf } = {}) => {
  if (!conf.get('helmet.enabled')) return;
  server.register(helmet, createHelmetOptions(conf));
};
