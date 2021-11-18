const { get } = require('@parameter1/base-web-object-path');
const bootServer = require('../boot');

const { log } = console;

process.env.BASE_BROWSE_GRAPHQL_URI = 'https://base-browse.virgon.base.parameter1.com/graphql';
process.env.GRAPHQL_URI = 'https://graphql.virgon.base.parameter1.com';
process.env.SITE_ID = '5fce561dd28860bc33b823ce';
process.env.TENANT_KEY = 'randallreilly_all';
process.env.COMPAT_ENABLED = 1;

const config = {
  cwd: __dirname,
  app: {
    // normally would come from the site's package.json
    name: '@randall-reilly/overdriveonline.com',
    version: '1.19.9',
  },
  routes: (server) => {
    server.get('/', (req, res) => res.json({ hello: 'world' }));
    server.get('/compat', (req, res) => {
      const { app } = req;
      const { $conf } = app;
      if (!$conf.get('compat.enabled')) return res.json(null);
      const toCheck = { app, req, res };
      const check = [
        'app.locals.tenantKey',
        'app.locals.config',
        'app.locals.site',
        'req.$baseBrowse',
        'res.locals.$baseBrowse',
        'req.apollo',
        'res.locals.apollo',
        'res.locals.requestOrigin',
      ];
      return res.json({
        props: check.reduce((o, path) => ({
          ...o, [path]: Boolean(get(toCheck, path)),
        }), {}),
        website: {
          name: app.locals.config.website('name'),
        },
      });
    });
  },
  hooks: {
    postInit: () => log('test postInit hook'),
    preRoutes: () => log('test preRoutes hook'),
    postRoutes: () => log('test postRoutes hook'),
  },
  robots: {
    directives: [{ agent: '*', value: 'Disallow: /search' }],
  },
  site: {
    name: 'Overdrive',
    host: 'www.overdriveonline.com',
    imageHost: 'img.overdriveonline.com',
    assetHost: 'cdn.overdriveonline.com',

    // would normally be loaded from the site's config folder
    config: {
      navigation: {
        primary: [
          { href: '/equipment', label: 'Equipment' },
          { href: '/business', label: 'Business' },
          { href: '/regulations', label: 'Regulations' },
          { href: '/life', label: 'Life' },
          { href: '/custom-rigs', label: 'Custom Rigs' },
          { href: '/gear', label: 'Gear' },
        ],
      },
    },
  },
};

bootServer({
  onBoot: () => log('test onBoot'),
  server: config,
});