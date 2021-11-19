require('@parameter1/base-web-marko-lib/require');
const bootServer = require('@parameter1/base-web-server-express');
const { getAsObject } = require('@parameter1/base-web-object-path');
const { isFunction: isFn } = require('@parameter1/base-web-utils');
const buildMarkoConfig = require('./config/build');
const { preRoutes } = require('./hooks');

module.exports = async ({
  marko,
  config,
} = {}) => {
  const $marko = await buildMarkoConfig(marko);
  const hooks = getAsObject(config, 'server.hooks');

  await bootServer({
    ...config,
    server: {
      ...getAsObject(config, 'server'),
      hooks: {
        ...hooks,
        preRoutes: async ({ server, conf }) => {
          if (isFn(hooks.preRoutes)) await hooks.preRoutes({ server, conf });
          preRoutes({ server, conf, marko: $marko });
        },
      },
    },
  });
};
