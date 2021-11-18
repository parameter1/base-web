const { immediatelyThrow } = require('@parameter1/base-web-utils');
const createServer = require('./create');

const { log } = console;
const { env } = process;
process.on('unhandledRejection', immediatelyThrow);

const defaults = { HOST: 'localhost', PORT: 45893 };

module.exports = ({
  exposedHost = env.EXPOSED_HOST || env.HOST || defaults.HOST,
  exposedPort = env.EXPOSED_PORT || env.PORT || defaults.PORT,
  host = env.HOST || defaults.HOST,
  port = env.PORT || defaults.PORT,
  ...params
} = {}) => {
  (async () => {
    log('Booting server...');
    const { server, conf } = await createServer(params);
    await new Promise((resolve, reject) => {
      server.listen({ host, port }, (err) => {
        if (err) { reject(err); return; }
        resolve();
      });
    });
    log(`App: ${conf.get('app.name')} v${conf.get('app.version')}`);
    log(`Tenant: ${conf.get('tenant.key')}`);
    log(`Site ID: ${conf.get('site.id')}`);
    log(`BaseBrowse GraphQL URI: ${conf.get('baseBrowseGraphQLClient.uri')}`);
    log(`BaseCMS GraphQL URI: ${conf.get('baseCMSGraphQLClient.uri')}`);
    log(`Ready on http://${exposedHost}:${exposedPort}`);
  })().catch(immediatelyThrow);
};
