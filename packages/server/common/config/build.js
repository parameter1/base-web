const { validateAsync } = require('@parameter1/joi/utils');
const { wrap } = require('@parameter1/base-web-object-path');
const { isFunction: isFn } = require('@parameter1/base-web-utils');
const fromEnv = require('./from-env');
const schema = require('./schema');

const { emitWarning } = process;

module.exports = async (params = {}) => {
  const validated = await validateAsync(schema, {
    ...params,
    baseBrowseGraphQLClient: {
      ...params.baseBrowseGraphQLClient,
      ...(fromEnv({ uri: ['BASE_BROWSE_GRAPHQL_CLIENT_URI', 'BASE_BROWSE_GRAPHQL_URI'] })),
    },
    baseCMSGraphQLClient: {
      ...params.baseCMSGraphQLClient,
      ...(fromEnv({
        uri: ['BASE_CMS_GRAPHQL_CLIENT_URI', 'GRAPHQL_URI'],
        cacheServerResponses: ['BASE_CMS_GRAPHQL_CLIENT_CACHE_SERVER_RESPONSES', 'CACHE_GQL_RESPONSES'],
        cacheServerSiteContext: ['BASE_CMS_GRAPHQL_CLIENT_CACHE_SERVER_SITE_CONTEXT', 'CACHE_GQL_SITE_CONTEXT'],
      })),
    },
    cookie: {
      ...params.cookie,
      ...(fromEnv({ enabled: 'COOKIE_ENABLED' })),
    },
    etag: {
      ...params.etag,
      ...(fromEnv({ enabled: 'ETAG_ENABLED', mode: 'ETAG_MODE' })),
    },
    helmet: {
      ...params.helmet,
      ...(fromEnv({ enabled: 'HELMET_ENABLED' })),
    },
    robots: {
      ...params.robots,
      ...(fromEnv({ enabled: 'ROBOTS_ENABLED', disallowAll: 'ROBOTS_DISALLOW_ALL' })),
    },
    server: {
      ...params.server,
      ...(fromEnv({
        host: 'HOST',
        port: 'PORT',
        exposedHost: ['EXPOSED_HOST', 'HOST'],
        exposedPort: ['EXPOSED_PORT', 'PORT'],
      })),
    },
    site: {
      ...params.site,
      ...(fromEnv({
        id: 'SITE_ID',
        name: 'SITE_NAME',
        host: 'SITE_HOST',
        imageHost: 'SITE_IMAGE_HOST',
        assetHost: 'SITE_ASSET_HOST',
      })),
    },
    tenant: {
      ...params.tenant,
      ...(fromEnv({ key: 'TENANT_KEY' })),
    },
  });
  const conf = wrap(validated);
  if (!conf.get('env')) {
    emitWarning('The NodeJS enviroment is unspecified. Please set via NODE_ENV or the `env` config value.');
  }

  // support site config as a function
  const siteConfig = conf.get('site.config');
  if (isFn(siteConfig)) conf.set('site.config', await siteConfig({ conf }));
  return conf;
};
