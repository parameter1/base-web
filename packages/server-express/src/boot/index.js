const bootService = require('@parameter1/terminus/boot-service');
const { log } = require('@parameter1/terminus/utils');
const { immediatelyThrow } = require('@parameter1/base-web-utils');
const buildBootConfig = require('./config/build');
const createServer = require('../create');

process.on('unhandledRejection', immediatelyThrow);

/**
 *
 */
module.exports = (params = {}) => {
  (async () => {
    const config = await buildBootConfig(params);
    const { server, conf } = await createServer(config.server);

    await bootService({
      name: conf.get('app.name'),
      version: conf.get('app.version'),
      server,
      host: config.host,
      exposedHost: config.exposedHost,
      port: config.port,
      exposedPort: config.exposedPort,

      healthCheckPath: config.healthCheckPath,

      onStart: config.onStart,
      onHealthCheck: config.onHealthCheck,
      onSignal: config.onSignal,
      onShutdown: config.onShutdown,
      beforeShutdown: config.beforeShutdown,
      onError: config.onError,

      onListen: () => {
        if (process.send) process.send({ event: 'ready', conf });
        if (conf.get('compat.enabled')) log('RUNNING IN COMPATIBILITY MODE!');
        log(`Env: ${process.env.NODE_ENV || '(not specified)'}`);
        log(`App: ${conf.get('app.name')} v${conf.get('app.version')}`);
        log(`Tenant: ${conf.get('tenant.key')}`);
        log(`Site ID: ${conf.get('site.id')}`);
        log(`BaseBrowse GraphQL URI: ${conf.get('baseBrowseGraphQLClient.uri')}`);
        log(`BaseCMS GraphQL URI: ${conf.get('baseCMSGraphQLClient.uri')}`);
      },
    });
  })().catch(immediatelyThrow);
};
