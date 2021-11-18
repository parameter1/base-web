const express = require('express');
const { build: buildServerConfig } = require('@parameter1/base-web-server-common/config');

module.exports = async (params = {}) => {
  const conf = await buildServerConfig(params);
  const server = express();

  server.set('trust proxy', conf.getAsArray('trustProxy'));
  server.$conf = conf;
  return { server, conf };
};
