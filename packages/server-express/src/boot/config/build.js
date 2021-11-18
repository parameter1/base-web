const { validateAsync } = require('@parameter1/joi/utils');
const { fromEnv } = require('@parameter1/base-web-server-common/config');
const schema = require('./schema');

module.exports = async (params = {}) => {
  const validated = await validateAsync(schema, {
    ...params,
    ...(fromEnv({
      host: 'HOST',
      port: 'PORT',
      exposedHost: ['EXPOSED_HOST', 'HOST'],
      exposedPort: ['EXPOSED_PORT', 'PORT'],
    })),
  });
  return validated;
};
