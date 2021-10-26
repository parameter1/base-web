import { immediatelyThrow } from '@parameter1/base-web-utils';
import createServer from './create/index.js';

const { log } = console;
const { env } = process;
process.on('unhandledRejection', immediatelyThrow);

const defaults = { HOST: 'localhost', PORT: 45893 };

export default ({
  exposedHost = env.EXPOSED_HOST || env.HOST || defaults.HOST,
  exposedPort = env.EXPOSED_PORT || env.PORT || defaults.PORT,
  host = env.HOST || defaults.HOST,
  port = env.PORT || defaults.PORT,
  ...options
} = {}) => {
  (async () => {
    log('Booting server...');
    const { conf, server } = await createServer(options);

    await new Promise((resolve, reject) => {
      server.listen({ host, port }, (err) => {
        if (err) { reject(err); return; }
        resolve();
      });
    });
    log(`App: ${conf.get('app.name')} v${conf.get('app.version')}`);
    log(`Tenant: ${conf.get('tenant.key')}`);
    log(`Site ID: ${conf.get('site.id')}`);
    log(`BaseBrowse GraphQL URI: ${conf.get('baseBrowseGraphQL.uri')}`);
    log(`BaseCMS GraphQL URI: ${conf.get('baseCMSGraphQL.uri')}`);
    log(`Ready on http://${exposedHost}:${exposedPort}`);
  })().catch(immediatelyThrow);
};
