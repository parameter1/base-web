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
      redirectHandler: () => {
        log({ redirectHandler: true });
        return null;
      },
      routes,
      robots: {
        directives: [{ agent: '*', value: 'Disallow: /search' }],
      },
      site: {
        name: 'Overdrive',
        host: 'www.overdriveonline.com',
        imageHost: 'img.overdriveonline.com',
        assetHost: 'cdn.overdriveonline.com',
        config: ({ conf }) => {
          log('site config as a function', conf);
          return {
            foo: 'bar',
          };
        },
      },
    },
  },
});
