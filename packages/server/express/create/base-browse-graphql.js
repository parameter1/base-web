const createClient = require('@parameter1/base-web-graphql-client');
const { createBaseBrowseOptions } = require('@parameter1/base-web-server-common/config');

module.exports = ({ server, conf } = {}) => {
  const { prop, ...config } = createBaseBrowseOptions({ conf });
  server.setToLocals(prop, createClient(config));
};
