process.env.NODE_ENV = 'development';
process.env.TERMINUS_TIMEOUT = 0; // should be 0 on dev.
process.env.TERMINUS_SILENT = true; // run silently on dev.

// virgon, rr ovd
// process.env.BASE_BROWSE_GRAPHQL_URI = 'https://base-browse.virgon.base.parameter1.com/graphql';
// process.env.GRAPHQL_URI = 'https://graphql.virgon.base.parameter1.com';
// process.env.SITE_ID = '5fce561dd28860bc33b823ce';
// process.env.TENANT_KEY = 'randallreilly_all';
// process.env.OEMBED_URI = 'https://oembed.virgon.base.parameter1.com';

// tauron, acbm fcp
process.env.BASE_BROWSE_GRAPHQL_URI = 'https://base-browse.tauron.base.parameter1.com/graphql';
process.env.GRAPHQL_URI = 'https://graphql.tauron.base.parameter1.com';
process.env.SITE_ID = '53ca8d671784f8066eb2c949';
process.env.TENANT_KEY = 'acbm_fcp';
process.env.OEMBED_URI = 'https://oembed.tauron.base.parameter1.com';

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
      browser: './browser/index.js',
    },
    compileDirs: ['../../packages/marko'],
    additionalWatchDirs: [
      '../../packages/marko/server',
      '../../packages/marko/components',
      '../../packages/marko/core',
      '../../packages/server/common',
      '../../packages/server/express',
    ],
    watchIgnore: ['./cli/**/*.js'],
    // cleanCompiledFiles: true,
  });
})().catch(immediatelyThrow);
