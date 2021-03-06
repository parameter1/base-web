const { validateAsync } = require('@parameter1/joi/utils');
const { wrap } = require('@parameter1/base-web-object-path');
const { fromEnv } = require('@parameter1/base-web-server-common/config');
const schema = require('./schema');

const { emitWarning } = process;

module.exports = async (params = {}) => {
  const validated = await validateAsync(schema, {
    ...params,
    compat: {
      ...params.compat,
      ...(fromEnv({ enabled: 'COMPAT_ENABLED' })),
    },
    oembed: {
      ...params.oembed,
      ...(fromEnv({ uri: 'OEMBED_URI' })),
    },
  });
  const conf = wrap(validated);
  if (conf.get('compat.enabled')) {
    process.env.COMPAT_ENABLED = true;
    emitWarning('The web server is running in "base-cms-marko-web" compatability mode. Update your site to use the latest features and then remove `compat.enabled: true` and/or `COMPAT_ENABLED` from the env.', 'DeprecationWarning');
  }
  return conf;
};
