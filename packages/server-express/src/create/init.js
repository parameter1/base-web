const express = require('express');
const { build: buildServerConfig } = require('@parameter1/base-web-server-common/config');

module.exports = async (params = {}) => {
  const conf = await buildServerConfig(params);
  const server = express();

  server.set('trust proxy', conf.getAsArray('trustProxy'));
  server.$conf = conf;
  // this is only being added to move `$conf` to the root marko out.global
  server.locals.$conf = conf;
  return { server, conf };
};
