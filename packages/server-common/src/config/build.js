import { validateAsync } from '@parameter1/joi/utils.js';
import { wrap } from '@parameter1/base-web-immutable';
import fromEnv from './from-env.js';
import schema from './schema.js';

export default async (params = {}) => {
  const validated = await validateAsync(schema, {
    ...params,
    baseBrowseGraphQLClient: {
      ...params.baseBrowseGraphQLClient,
      ...(fromEnv({ enabled: 'BASE_BROWSE_GRAPHQL_CLIENT_ENABLED', uri: 'BASE_BROWSE_GRAPHQL_CLIENT_URI' })),
    },
    baseCMSGraphQLClient: {
      ...params.baseCMSGraphQLClient,
      ...(fromEnv({
        enabled: 'BASE_CMS_GRAPHQL_CLIENT_ENABLED',
        uri: 'BASE_CMS_GRAPHQL_CLIENT_URI',
        cacheServerResponses: 'BASE_CMS_GRAPHQL_CLIENT_CACHE_SERVER_RESPONSES',
        cacheServerSiteContext: 'BASE_CMS_GRAPHQL_CLIENT_CACHE_SERVER_SITE_CONTEXT',
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
  return wrap(validated);
};
