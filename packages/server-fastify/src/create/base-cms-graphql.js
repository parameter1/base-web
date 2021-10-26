import apollo from '@parameter1/base-web-apollo-ssc-fastify';
import { createBaseCMSOptions } from '@parameter1/base-web-server-common';

export default ({ server, conf } = {}) => {
  if (!conf.get('baseCMSGraphQLClient.enabled')) return;
  server.register(apollo, createBaseCMSOptions(conf));
};
