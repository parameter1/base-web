import apollo from '@parameter1/base-web-apollo-ssc-express';
import { createBaseCMSOptions } from '@parameter1/base-web-server-common';

export default ({ server, conf } = {}) => {
  if (!conf.get('baseCMSGraphQLClient.enabled')) return;
  server.use(apollo(createBaseCMSOptions(conf)));
};
