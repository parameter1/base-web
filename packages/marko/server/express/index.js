require('@parameter1/base-web-marko-lib/require');
const bootServer = require('@parameter1/base-web-server-express');
const { getAsObject } = require('@parameter1/base-web-object-path');
const { isFunction: isFn } = require('@parameter1/base-web-utils');
const distLoader = require('@parameter1/base-web-marko-server-common/dist-loader');
const buildMarkoConfig = require('@parameter1/base-web-marko-server-common/config/build');
const { preRoutes } = require('./hooks');
const errorRenderer = require('./error-renderer');

module.exports = async ({
  marko: markoConf,
  config,
} = {}) => {
  const marko = await buildMarkoConfig(markoConf);
  const hooks = getAsObject(config, 'server.hooks');
  const error = getAsObject(config, 'server.error');

  await bootServer({
    ...config,
    server: {
      ...getAsObject(config, 'server'),
      error: {
        renderer: errorRenderer,
        ...error,
      },
      hooks: {
        ...hooks,
        preRoutes: async ({ server, conf }) => {
          if (isFn(hooks.preRoutes)) await hooks.preRoutes({ server, conf });
          // set dist assets before boot to cache the manifest parsing and throw
          // errors before the server is launched.
          const dist = {
            js: distLoader({ conf, type: 'js' }),
            css: distLoader({ conf, type: 'css' }),
          };
          dist.js();
          dist.css();
          marko.set('dist', dist);

          preRoutes({ server, conf, marko });
        },
      },
    },
  });
};
