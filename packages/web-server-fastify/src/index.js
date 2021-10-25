import { immediatelyThrow } from '@parameter1/marko-base-cms-utils';
import createServer from './create.js';

const { log } = console;
const { env } = process;
process.on('unhandledRejection', immediatelyThrow);

const defaults = { HOST: 'localhost', PORT: 45894 };

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

    await server.listen({ host, port });
    log(`App: ${conf.get('app.name')} v${conf.get('app.version')}`);
    log(`Tenant: ${conf.get('tenant.key')}`);
    log(`Site ID: ${conf.get('site.id')}`);
    log(`BaseCMS GraphQL URL: ${conf.get('baseCMSGraphQL.url')}`);
    log(`Ready on http://${exposedHost}:${exposedPort}`);
  })().catch(immediatelyThrow);
};
