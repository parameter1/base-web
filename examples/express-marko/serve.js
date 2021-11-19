const serve = require('@parameter1/base-web-marko-cli/serve');
const { immediatelyThrow } = require('@parameter1/base-web-utils');

process.on('unhandledRejection', immediatelyThrow);

const { log } = console;
log('Serving...');

(async () => {
  await serve({
    cwd: __dirname,
    serverEntry: 'index.js',
    compileDirs: ['../../packages/marko'],
    additionalWatchDirs: ['../../packages/marko/server', '../../packages/marko/core'],
    watchIgnore: ['./serve.js'],
  });
})().catch(immediatelyThrow);
