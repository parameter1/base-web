import { validateAsync } from '@parameter1/joi/utils.js';
import { get } from '@parameter1/marko-base-cms-object-path';
import { wrap } from '@parameter1/marko-base-cms-immutable';
import schema from './schema.js';

const { env } = process;

export default async (params = {}) => {
  const validated = await validateAsync(schema, {
    ...params,
    baseBrowseGraphQL: {
      ...params.baseBrowseGraphQL,
      uri: get(params, 'baseBrowseGraphQL.uri') || env.BASE_BROWSE_GRAPHQL_URI,
    },
    baseCMSGraphQL: {
      ...params.baseCMSGraphQL,
      uri: get(params, 'baseCMSGraphQL.uri') || env.BASE_CMS_GRAPHQL_URI,
      ...(get(params, 'baseCMSGraphQL.cacheResponses') == null && { cacheResponses: env.BASE_CMS_GRAPHQL_CACHE_RESPONSES }),
    },
    etag: {
      ...params.etag,
      ...(env.ETAG_ENABLED && { enabled: env.ETAG_ENABLED }),
      ...(env.ETAG_MODE && { mode: env.ETAG_MODE }),
    },
    site: {
      ...params.site,
      id: get(params, 'site.id') || env.SITE_ID,
      name: get(params, 'site.name') || env.SITE_NAME,
      host: get(params, 'site.host') || env.SITE_HOST,
      imageHost: get(params, 'site.imageHost') || env.SITE_HOST,
      assetHost: get(params, 'site.assetHost') || env.SITE_ASSET_HOST,
    },
    tenant: {
      ...params.tenant,
      key: get(params, 'tenant.key') || env.TENANT_KEY,
    },
  });
  return wrap(validated);
};
