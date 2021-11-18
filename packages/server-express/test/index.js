const bootServer = require('../boot');
const pkg = require('../package.json');

const { log } = console;

process.env.BASE_BROWSE_GRAPHQL_URI = 'http://base-browse';
process.env.GRAPHQL_URI = 'http://base-cms';
process.env.SITE_ID = '5fce561dd28860bc33b823ce';
process.env.TENANT_KEY = 'randallreilly_all';
process.env.COMPAT_ENABLED = 1;

const config = {
  cwd: __dirname,
  app: { name: pkg.name, version: pkg.version },
  routes: (server) => {
    server.get('/', (req, res) => res.json({ hello: 'world' }));
  },
  hooks: {
    postInit: () => log('test postInit hook'),
    preRoutes: () => log('test preRoutes hook'),
    postRoutes: () => log('test postRoutes hook'),
  },
  site: {
    name: 'Overdrive',
    host: 'www.overdriveonline.com',
    imageHost: 'img.overdriveonline.com',
    assetHost: 'cdn.overdriveonline.com',
  },
};

bootServer({
  onBoot: () => log('test onBoot'),
  server: config,
});
