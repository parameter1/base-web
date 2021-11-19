const express = require('express');
const { build: buildServerConfig } = require('@parameter1/base-web-server-common/config');
const { set } = require('@parameter1/base-web-object-path');

module.exports = async (params = {}) => {
  const conf = await buildServerConfig(params);
  const server = express();

  server.set('trust proxy', conf.getAsArray('trustProxy'));
  server.setToLocals = (path, value) => {
    set(server.locals, path, value);
    return server;
  };
  server.$conf = conf;
  return { server, conf };
};
