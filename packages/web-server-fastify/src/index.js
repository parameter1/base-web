import { immediatelyThrow } from '@parameter1/marko-base-cms-utils';
import createServer from './create.js';
import {
  EXPOSED_HOST,
  EXPOSED_PORT,
  HOST,
  PORT,
} from './env.js';

const { log } = console;
process.on('unhandledRejection', immediatelyThrow);

export default (options = {}) => {
  (async () => {
    const server = await createServer(options);
    await server.listen({ host: HOST, port: PORT });
    log(`Ready on http://${EXPOSED_HOST}:${EXPOSED_PORT}`);
  })().catch(immediatelyThrow);
};
