const createClient = require('@parameter1/base-web-graphql-client');
const { createBaseCMSOptions } = require('@parameter1/base-web-server-common/config');

module.exports = ({ server, conf } = {}) => {
  const { prop, ...config } = createBaseCMSOptions({ conf });
  server.setToLocals(prop, createClient(config));
};
