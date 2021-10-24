import { validateAsync } from '@parameter1/joi/utils.js';
import { get } from '@parameter1/marko-base-cms-object-path';
import { wrap } from '@parameter1/marko-base-cms-immutable';
import schema from './schema.js';

const { env } = process;

export default async (params = {}) => {
  const validated = await validateAsync(schema, {
    ...params,
    baseCMSGraphQL: {
      ...params.baseCMSGraphQL,
      url: get(params, 'baseCMSGraphQL.url') || env.BASE_CMS_GRAPHQL_URL,
      ...(get(params, 'baseCMSGraphQL.cacheResponses') == null && { cacheResponses: env.CACHE_GQL_RESPONSES }),
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
