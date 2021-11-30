const bootServer = require('@parameter1/base-web-marko-server-express');
const pkg = require('./package.json');
const routes = require('./server/routes');

const { log } = console;

bootServer({
  marko: {
    compat: { enabled: true },
    error: {
      asyncBlockNotifier: (error) => log('Send to a logging service like NR', error),
    },
  },
  config: {
    server: {
      app: { name: pkg.name, version: pkg.version },
      cwd: __dirname,
      error: {
        notifier: (error) => {
          if (error.status > 499) log('Fatal error notifer, send to NR', error);
        },
      },
      redirectHandler: () => null,
      routes,
      robots: {
        directives: [{ agent: '*', value: 'Disallow: /search' }],
      },
      site: {
        name: 'For Construction Pros',
        host: 'www.forconstructionpros.com',
        imageHost: 'img.forconstructionpros.com',
        assetHost: 'cdn.base.parameter1.com',
        config: ({ conf }) => ({
          foo: conf.get('site.name'),
        }),
      },
      // site: {
      //   name: 'Overdrive',
      //   host: 'www.overdriveonline.com',
      //   imageHost: 'img.overdriveonline.com',
      //   assetHost: 'cdn.overdriveonline.com',
      //   config: ({ conf }) => ({
      //     foo: conf.get('site.name'),
      //   }),
      // },
    },
  },
});
