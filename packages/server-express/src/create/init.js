const express = require('express');
const buildServerConfig = require('@parameter1/base-web-server-common/build-config');

module.exports = async (params = {}) => {
  const conf = await buildServerConfig(params);
  const server = express();

  server.set('trust proxy', conf.getAsArray('trustProxy'));
  server.$conf = conf;
  return { server, conf };
};
