process.env.BASE_BROWSE_GRAPHQL_URI = 'https://base-browse.virgon.base.parameter1.com/graphql';
process.env.GRAPHQL_URI = 'https://graphql.virgon.base.parameter1.com';
process.env.SITE_ID = '5fce561dd28860bc33b823ce';
process.env.TENANT_KEY = 'randallreilly_all';
process.env.NODE_ENV = 'development';

const bootServer = require('@parameter1/base-web-marko-server-express');
const pkg = require('./package.json');
const routes = require('./server/routes');

bootServer({
  marko: { compat: { enabled: true } },
  config: {
    server: {
      app: { name: pkg.name, version: pkg.version },
      cwd: __dirname,
      routes,
      robots: {
        directives: [{ agent: '*', value: 'Disallow: /search' }],
      },
      site: {
        name: 'Overdrive',
        host: 'www.overdriveonline.com',
        imageHost: 'img.overdriveonline.com',
        assetHost: 'cdn.overdriveonline.com',
      },
    },
  },
});
