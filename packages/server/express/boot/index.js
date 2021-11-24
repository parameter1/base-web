const bootService = require('@parameter1/terminus/boot-service');
const { log } = require('@parameter1/terminus/utils');
const { immediatelyThrow } = require('@parameter1/base-web-utils');
const { emitReady } = require('@parameter1/base-web-server-common/config');
const buildBootConfig = require('./config/build');
const createServer = require('../create');

process.on('unhandledRejection', immediatelyThrow);

/**
 *
 */
module.exports = async (params = {}) => {
  await (async () => {
    const config = await buildBootConfig(params);
    const { server, conf } = await createServer(config.server);

    await bootService({
      name: conf.get('app.name'),
      version: conf.get('app.version'),
      server,
      host: conf.get('server.host'),
      exposedHost: conf.get('server.exposedHost'),
      port: conf.get('server.port'),
      exposedPort: conf.get('server.exposedPort'),

      healthCheckPath: config.healthCheckPath,

      onStart: config.onBoot,
      onHealthCheck: config.onHealthCheck,
      onSignal: config.onSignal,
      onShutdown: config.onShutdown,
      beforeShutdown: config.beforeShutdown,
      onError: config.onError,

      onListen: () => emitReady({ conf, log }),
    });
  })().catch(immediatelyThrow);
};
