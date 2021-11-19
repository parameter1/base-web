const serve = require('@parameter1/base-web-marko-cli/serve');
const { immediatelyThrow } = require('@parameter1/base-web-utils');
const path = require('path');

process.on('unhandledRejection', immediatelyThrow);

const { log } = console;
log('Serving...');

(async () => {
  await serve({
    cwd: path.resolve(__dirname, '../'),
    entries: {
      server: './index.js',
      styles: './server/styles/index.scss',
    },
    compileDirs: ['../../packages/marko'],
    additionalWatchDirs: [
      '../../packages/marko/server',
      '../../packages/marko/core',
      '../../packages/server/common',
      '../../packages/server/express',
    ],
    watchIgnore: ['./cli/**/*.js'],
  });
})().catch(immediatelyThrow);
