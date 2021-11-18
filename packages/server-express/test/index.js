const bootServer = require('../boot');
const pkg = require('../package.json');

process.env.BASE_BROWSE_GRAPHQL_URI = 'http://base-browse';
process.env.GRAPHQL_URI = 'http://base-cms';
process.env.SITE_ID = '5fce561dd28860bc33b823ce';
process.env.TENANT_KEY = 'randallreilly_all';

const config = {
  rootDir: __dirname,
  app: { name: pkg.name, version: pkg.version },
  routes: (server) => {
    server.get('/', (_, res) => res.json({ hello: 'world' }));
  },
  site: {
    name: 'Overdrive',
    host: 'www.overdriveonline.com',
    imageHost: 'img.overdriveonline.com',
    assetHost: 'cdn.overdriveonline.com',
  },
};

bootServer({ server: config });
