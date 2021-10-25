import apollo from '@parameter1/base-web-apollo-ssc-fastify';
import { createBaseBrowseOptions } from '@parameter1/base-web-server-common';

export default ({ server, conf } = {}) => {
  if (!conf.get('baseBrowseGraphQL.enabled')) return;
  server.register(apollo, createBaseBrowseOptions(conf));
};
