import { immediatelyThrow } from '@parameter1/marko-base-cms-utils';

import createServer from './create.js';

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
    const server = await createServer(options);

    await new Promise((resolve, reject) => {
      server.listen({ host, port }, (err) => {
        if (err) { reject(err); return; }
        resolve();
      });
    });
    log(`Ready on http://${exposedHost}:${exposedPort}`);
  })().catch(immediatelyThrow);
};
