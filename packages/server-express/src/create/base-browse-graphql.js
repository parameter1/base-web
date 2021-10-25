import apollo from '@parameter1/base-web-apollo-ssc-express';
import { createBaseBrowseOptions } from '@parameter1/base-web-server-common';

export default ({ server, conf } = {}) => {
  if (!conf.get('baseBrowseGraphQL.enabled')) return;
  server.use(apollo(createBaseBrowseOptions(conf)));
};
