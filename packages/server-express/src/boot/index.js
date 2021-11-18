const { immediatelyThrow } = require('@parameter1/base-web-utils');
const buildBootConfig = require('./config/build');
const createServer = require('../create');

const { log } = console;
process.on('unhandledRejection', immediatelyThrow);

/**
 * @todo add terminus handling!
 */
module.exports = (params = {}) => {
  (async () => {
    const config = await buildBootConfig(params);
    const { server, conf } = await createServer(config.server);
    await new Promise((resolve, reject) => {
      server.listen({ host: config.host, port: config.port }, (err) => {
        if (err) { reject(err); return; }
        resolve();
      });
    });
    log(`App: ${conf.get('app.name')} v${conf.get('app.version')}`);
    log(`Tenant: ${conf.get('tenant.key')}`);
    log(`Site ID: ${conf.get('site.id')}`);
    log(`BaseBrowse GraphQL URI: ${conf.get('baseBrowseGraphQLClient.uri')}`);
    log(`BaseCMS GraphQL URI: ${conf.get('baseCMSGraphQLClient.uri')}`);
    log(`Ready on http://${config.exposedHost}:${config.exposedPort}`);
  })().catch(immediatelyThrow);
};
