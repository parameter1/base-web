import { validateAsync } from '@parameter1/joi/utils.js';
import { wrap } from '@parameter1/base-web-immutable';
import fromEnv from './from-env.js';
import schema from './schema.js';

export default async (params = {}) => {
  const validated = await validateAsync(schema, {
    ...params,
    baseBrowseGraphQL: {
      ...params.baseBrowseGraphQL,
      ...(fromEnv({ uri: 'BASE_BROWSE_GRAPHQL_URI' })),
    },
    baseCMSGraphQL: {
      ...params.baseCMSGraphQL,
      ...(fromEnv({ uri: 'BASE_CMS_GRAPHQL_URI', cacheResponses: 'BASE_CMS_GRAPHQL_CACHE_RESPONSES' })),
    },
    etag: {
      ...params.etag,
      ...(fromEnv({ enabled: 'ETAG_ENABLED', mode: 'ETAG_MODE' })),
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
